import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { extractKeywordsWithLlama, generateConversationResponse } from '../../services/aiService';
import TopMatchCarCards from '../cars/TopMatchCarCards';
import { findMatchingCars } from '../../services/carService';

const VoiceAssistant = ({ 
  onKeywordsUpdate, 
  containerStyle = {}, 
  futuristicStyle = false 
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', content: 'Hi there! I can help you find the perfect car. What are you looking for?' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conciseMode, setConciseMode] = useState(false);
  const [showCarOverlay, setShowCarOverlay] = useState(false);
  const [matchingCars, setMatchingCars] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const speechRecognition = useRef(null);
  const overlayRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update car recommendations when keywords change
  useEffect(() => {
    if (keywords.length > 0) {
      // Find matching cars
      const matches = findMatchingCars(keywords);
      const availableCars = matches.filter(car => car.inStore);
      setMatchingCars(availableCars);
      
      if (availableCars.length > 0) {
        setShowCarOverlay(true);
      }
    } else {
      setMatchingCars([]);
    }
  }, [keywords]);

  // Add click outside event listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setShowCarOverlay(false);
      }
    }

    if (showCarOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCarOverlay]);

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
      const extractedKeywords = await extractKeywordsWithLlama(text);
      
      // Check if we need to clear all keywords (forget command)
      if (extractedKeywords.includes("__CLEAR_KEYWORDS__")) {
        // Reset keywords
        setKeywords([]);
        
        // Add AI confirmation message
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          content: "I've cleared all your preferences. Let's start fresh! What kind of car are you looking for now?" 
        }]);
        
        setIsProcessing(false);
        return; // Exit early
      }
      
      // Update keywords state
      if (extractedKeywords.length > 0) {
        setKeywords(prev => {
          // Create a new array with unique values
          // Put the newest keywords at the end for proper prioritization
          const combined = [...prev, ...extractedKeywords];
          return [...new Set(combined)];
        });
      }
      
      // Pass keywords up to parent component
      if (onKeywordsUpdate && extractedKeywords.length > 0) {
        onKeywordsUpdate(extractedKeywords);
      }
      
      // Generate AI response
      const aiResponse = await generateConversationResponse(text, extractedKeywords, messages, conciseMode);
      
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
      position: 'relative',
      ...containerStyle
    }}>
      {/* Car Recommendations Overlay */}
      <AnimatePresence>
        {showCarOverlay && matchingCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(8px)',
              background: 'rgba(9, 11, 16, 0.85)',
            }}
          >
            <Box 
              ref={overlayRef}
              sx={{                maxWidth: '900px',
                width: '100%',
                p: 4,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(17,17,17,0.95) 0%, rgba(0,0,0,0.98) 100%)',
                border: '1px solid rgba(255, 184, 0, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 184, 0, 0.2)',
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6"
                  className="orbitron"
                  sx={{
                    color: '#FFB800',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(255, 184, 0, 0.5)',
                  }}
                >
                  TOP MATCHES
                </Typography>
                <IconButton                  onClick={() => setShowCarOverlay(false)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#FFB800',
                      backgroundColor: 'rgba(255, 184, 0, 0.1)',
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <TopMatchCarCards cars={matchingCars.slice(0, 3)} />
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"                  onClick={() => setShowCarOverlay(false)}
                  sx={{
                    borderColor: '#FFB800',
                    color: '#FFB800',
                    borderRadius: '50px',
                    px: 4,
                    py: 1,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 184, 0, 0.1)',
                      borderColor: '#FFB800',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 15px rgba(255, 184, 0, 0.3)',
                    },
                  }}
                >
                  CONTINUE CHATTING
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>      <Paper 
        elevation={0} 
        ref={messagesContainerRef}       
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          p: 2, 
          overflow: 'auto', // Enable scrolling
          maxHeight: 'calc(500px - 120px)', // Fixed height for messages area, minus space for input
          bgcolor: futuristicStyle ? 'transparent' : 'background.paper',
          border: '1px solid',
          borderColor: futuristicStyle ? 'rgba(255,184,0,0.2)' : 'divider',
          borderRadius: '6px', // Reduced rounded edges
          display: 'flex',
          flexDirection: 'column',
          ...(futuristicStyle && {
            backdropFilter: 'blur(5px)',
            background: 'linear-gradient(135deg, rgba(26,30,42,0.4) 0%, rgba(16,19,26,0.2) 100%)',
          })
        }}
      >

        <Box sx={{ flexGrow: 1 }}>
          {messages.map((msg, index) => (
            <Box 
              key={index} 
              component={motion.div}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                type: 'spring',
                damping: 20,
                stiffness: 300,
                delay: 0.1 
              }}
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
                borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',                bgcolor: msg.sender === 'user' 
                  ? (futuristicStyle ? 'rgba(255,184,0,0.15)' : 'primary.light') 
                  : (futuristicStyle ? 'rgba(255,255,255,0.03)' : 'grey.100'),
                color: msg.sender === 'user' 
                  ? (futuristicStyle ? '#FFFFFF' : 'white') 
                  : (futuristicStyle ? '#FFFFFF' : 'text.primary'),
                border: futuristicStyle ? '1px solid' : 'none',
                borderColor: msg.sender === 'user' 
                  ? 'rgba(255,184,0,0.3)' 
                  : 'rgba(255,255,255,0.05)',
                boxShadow: msg.sender === 'user' 
                  ? '0 4px 12px rgba(255,184,0,0.2)' 
                  : '0 2px 8px rgba(0,0,0,0.2)',
                ...(futuristicStyle && {
                  position: 'relative',                  '&::before': msg.sender === 'user' ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '40%',
                    height: '2px',
                    background: 'linear-gradient(to left, rgba(255,184,0,0.9), transparent)',
                  } : {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: '2px',
                    background: 'linear-gradient(to right, rgba(255,184,0,0.9), transparent)',
                  },
                  '&::after': msg.sender === 'user' ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '20%',
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(255,184,0,0.7), transparent)',
                  } : {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20%',
                    height: '1px',
                    background: 'linear-gradient(to left, rgba(255,184,0,0.7), transparent)',
                  }
                })
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
        ...(futuristicStyle && {
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '6px',
          border: '1px solid rgba(255,184,0,0.2)',
          px: 2,
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,184,0,0.3), transparent)',
          },
        })
      }}>
        <IconButton 
          component={motion.button}
          animate={isListening ? {
            scale: [1, 1.2, 1],
            boxShadow: ['0 0 0px rgba(255,51,102,0)', '0 0 10px rgba(255,51,102,0.5)', '0 0 0px rgba(255,51,102,0)']
          } : {}}
          transition={{ 
            repeat: isListening ? Infinity : 0,
            duration: 1.5
          }}
          sx={{ 
            mr: 1,
            color: isListening ? '#FF3366' : '#FFB800',
            backgroundColor: isListening ? 'rgba(255,51,102,0.15)' : 'rgba(255,184,0,0.15)',
            '&:hover': {
              backgroundColor: isListening ? 'rgba(255,51,102,0.25)' : 'rgba(255,184,0,0.25)'
            }
          }} 
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
              '& fieldset': {
                borderColor: 'rgba(255,184,0,0.2)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,184,0,0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFB800',
                borderWidth: '1px',
                boxShadow: '0 0 8px rgba(255,184,0,0.4)',
              },
              '& input::placeholder': { 
                color: 'rgba(255,255,255,0.5)',
                opacity: 1,
              }
            },
            '& .MuiInputBase-input': {
              color: '#FFFFFF',
              padding: '10px 14px',
            }
          }}
        />
        
        <IconButton 
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          color="primary" 
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isProcessing}
          sx={{
            ml: 1,
            backgroundColor: 'rgba(255,184,0,0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255,184,0,0.25)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255,255,255,0.2)',
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VoiceAssistant;