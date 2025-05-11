import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, CircularProgress } from '@mui/material';
import { Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { extractKeywordsWithLlama, generateConversationResponse } from '../../services/aiService';

const VoiceAssistant = ({ onKeywordsUpdate, conciseMode = false, containerStyle = {} }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', content: 'Hi there! I can help you find the perfect car. What are you looking for?' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const speechRecognition = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update the scrollToBottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      // Scroll the messages container instead of the whole page
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', content: text }]);
    setInput('');
    
    try {
      setIsProcessing(true);
      
      // Extract keywords but don't show them to the user
      const keywords = await extractKeywordsWithLlama(text);
      
      // Pass keywords up to parent component
      if (onKeywordsUpdate && keywords.length > 0) {
        onKeywordsUpdate(keywords);
      }
      
      // Generate AI response
      const aiResponse = await generateConversationResponse(text, keywords, messages, conciseMode);
      
      // Add AI response to chat
      setMessages(prev => {
        // Limit the number of messages to keep in view (e.g., last 10 messages)
        const maxMessages = 10;
        const newMessages = [...prev, { sender: 'ai', content: aiResponse }];
        
        // If we have more than maxMessages, trim the oldest ones
        return newMessages.length > maxMessages 
          ? newMessages.slice(newMessages.length - maxMessages) 
          : newMessages;
      });
      
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        content: "I'm sorry, I couldn't process that. Can you try again?" 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      speechRecognition.current?.stop();
      setIsListening(false);
    } else {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser doesn't support speech recognition. Try Chrome.");
        return;
      }
      
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      speechRecognition.current = recognition;
    }
  };

  return (
    <Box sx={{ 
      py: 2, 
      px: 2, 
      height: '500px', // Fixed height for the entire component
      display: 'flex', 
      flexDirection: 'column',
      ...containerStyle
    }}>
      <Paper 
        elevation={0} 
        ref={messagesContainerRef}
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          p: 2, 
          overflow: 'auto', // Enable scrolling
          maxHeight: 'calc(500px - 120px)', // Fixed height for messages area, minus space for input
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {messages.map((msg, index) => (
            <Box 
              key={index} 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1.5
              }}
            >
              <Box sx={{
                maxWidth: '85%',
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
              }}>
                <Typography variant="body1">
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        height: '56px', // Fixed height for input area
      }}>
        <IconButton 
          color={isListening ? "secondary" : "default"} 
          onClick={toggleSpeechRecognition}
        >
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me what car you're looking for..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
          disabled={isProcessing}
          variant="outlined"
          size="small"
        />
        <IconButton 
          color="primary" 
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isProcessing}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VoiceAssistant;