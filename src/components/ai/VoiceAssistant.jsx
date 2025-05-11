import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Chip, 
  CircularProgress, 
  TextField,
  InputAdornment,
  Button,
  Tab,
  Tabs
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import SendIcon from '@mui/icons-material/Send';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicRecorder from 'mic-recorder-to-mp3';
import { findMatchingCars, getSimilarAvailableCars } from '../../services/carService';
import { extractKeywordsWithLlama, generateCarRecommendation, compareVehicles } from '../../services/aiService';

const VoiceContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  maxWidth: '800px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
}));

const PulseCircle = styled(Box)(({ theme, isRecording }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isRecording ? '300px' : '0px',
  height: isRecording ? '300px' : '0px',
  borderRadius: '50%',
  background: theme.palette.primary.main,
  opacity: 0.1,
  transition: 'all 0.5s ease',
  animation: isRecording ? 'pulse 2s infinite' : 'none',
  '@keyframes pulse': {
    '0%': {
      transform: 'translate(-50%, -50%) scale(0.95)',
      opacity: 0.2,
    },
    '50%': {
      transform: 'translate(-50%, -50%) scale(1.05)',
      opacity: 0.1,
    },
    '100%': {
      transform: 'translate(-50%, -50%) scale(0.95)',
      opacity: 0.2,
    },
  },
}));

const RecordButton = styled(IconButton)(({ theme, isRecording }) => ({
  backgroundColor: isRecording ? theme.palette.error.main : theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: isRecording ? theme.palette.error.dark : theme.palette.primary.dark,
  },
  transition: 'all 0.3s ease',
  transform: isRecording ? 'scale(1.1)' : 'scale(1)',
}));

const ConversationBubble = styled(Paper)(({ theme, isAi }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  borderRadius: isAi ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
  backgroundColor: isAi ? '#f5f5f5' : theme.palette.primary.light,
  color: isAi ? 'inherit' : '#fff',
  maxWidth: '80%',
  alignSelf: isAi ? 'flex-start' : 'flex-end',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));

const KeywordChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.light,
  '&.active': {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const VoiceAssistant = ({ onKeywordsUpdate, conciseMode = false, containerStyle = {} }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [matchedCars, setMatchedCars] = useState([]);
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputMethod, setInputMethod] = useState('voice'); // 'voice' or 'text'
  const [textInput, setTextInput] = useState('');
  const conversationRef = useRef(null);
  const currentSpeechRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const greeting = "Hi there! I'm your virtual car assistant. Tell me what kind of car you're looking for, and I'll help you find the perfect match. You can mention things like type, price range, features, or specific needs.";
      addAIMessage(greeting);
    }, 1000);
  }, []);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition. Try Chrome.");
      return;
    }
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsRecording(true);
      addAIMessage("I'm listening. Tell me about your car preferences...");
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processUserInput(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      setIsProcessing(false);
      addAIMessage("Sorry, I couldn't hear you. Please try again.");
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  // Add this function to use either LLaMA or fallback extraction
  const processUserInput = async (text) => {
    addUserMessage(text);
    setIsProcessing(true);
    
    try {
      let extractedKeywords = [];
      
      // First try to extract with LLaMA if available
      try {
        extractedKeywords = await extractKeywordsWithLlama(text);
      } catch (llmError) {
        console.log("LLaMA extraction failed, using fallback:", llmError);
        // Fallback to simple keyword extraction
        extractedKeywords = extractKeywords(text);
      }
      
      // Update keywords
      const newKeywords = [...new Set([...keywords, ...extractedKeywords])];
      setKeywords(newKeywords);
      
      // Notify parent component about new keywords
      if (onKeywordsUpdate && extractedKeywords.length > 0) {
        onKeywordsUpdate(extractedKeywords);
      }
      
      // Find matching cars based on keywords
      const matches = findMatchingCars(newKeywords);
      setMatchedCars(matches);
      
      // Generate response - try LLaMA first, fall back to simple generation
      let aiResponse;
      try {
        aiResponse = await generateCarRecommendation(text, matches.slice(0, 3), newKeywords);
      } catch (responseError) {
        console.log("LLaMA response failed, using fallback:", responseError);
        aiResponse = generateAIResponse(text, matches, newKeywords);
      }
      
      addAIMessage(aiResponse);
    } catch (error) {
      console.error("Error processing user input:", error);
      addAIMessage("I'm having trouble understanding that. Could you try rephrasing?");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple keyword extraction function as fallback when LLaMA is unavailable
  const extractKeywords = (text) => {
    const keywordMap = {
      family: ["family", "kids", "spacious", "safe", "practical", "room"],
      luxury: ["luxury", "premium", "high-end", "comfortable", "fancy", "expensive"],
      sports: ["sports", "fast", "quick", "performance", "speed", "powerful"],
      economic: ["affordable", "cheap", "budget", "economical", "fuel efficient", "saving"],
      electric: ["electric", "ev", "battery", "tesla", "environmental", "green"],
      suv: ["suv", "crossover", "tall", "offroad", "utility"],
      sedan: ["sedan", "saloon", "four-door"],
      convertible: ["convertible", "open-top", "cabriolet", "roadster"]
    };
    
    const result = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(keywordMap).forEach(([category, words]) => {
      if (words.some(word => lowerText.includes(word))) {
        result.push(category);
      }
    });
    
    // Call parent callback with new keywords
    if (result.length > 0 && onKeywordsUpdate) {
      onKeywordsUpdate(result);
    }
    
    return result;
  };

  // Simple AI response generation as fallback when LLaMA is unavailable
  const generateAIResponse = (userInput, matches, currentKeywords) => {
    // For concise mode, use shorter, more direct responses
    if (conciseMode) {
      if (currentKeywords.length === 0) {
        return "What kind of car are you looking for? Maybe a sedan, SUV, or something sporty?";
      }
      
      if (currentKeywords.length === 1) {
        return `Great, you're interested in ${currentKeywords[0]} cars. What's your budget range? And do you have any specific features in mind?`;
      }
      
      if (matches.filter(car => car.inStore).length > 0) {
        return "Based on what you've shared, I've found some good options for you. Anything specific you'd like to know about these cars?";
      }
      
      return "Tell me more about what you need. Are fuel efficiency, luxury features, or cargo space more important to you?";
    }
    
    // Original, more verbose responses for non-concise mode
    const lowerInput = userInput.toLowerCase();
    
    // If user specifically asks about a car that's not in store
    const unavailableCars = matches.filter(car => !car.inStore);
    for (const car of unavailableCars) {
      if (lowerInput.includes(car.name.toLowerCase())) {
        // Generate comparison with available alternative
        const alternative = getSimilarAvailableCars(car, 1)[0];
        if (alternative) {
          return compareCarWithAlternative(car, alternative);
        }
      }
    }
    
    // If we have matches, recommend them
    if (matches.filter(car => car.inStore).length > 0) {
      const availableMatches = matches.filter(car => car.inStore);
      const topMatch = availableMatches[0];
      
      return `Based on what you're looking for, the ${topMatch.name} might be perfect for you. It's ${topMatch.description.toLowerCase()}. Would you like to know more about its features or would you prefer to see other options?`;
    }
    
    // If no matches or need more info
    if (currentKeywords.length === 0 || matches.length === 0) {
      return "I'd like to learn more about what you're looking for. Could you tell me if you prefer an SUV, sedan, or something sporty? And what features are most important to you - fuel efficiency, luxury, performance, or family-friendly space?";
    }
    
    // Continue conversation
    return "Thanks for sharing that. To help you find the perfect car, can you tell me more about your typical driving needs and what your budget range is?";
  };

  // Make sure to define compareCarWithAlternative if you're using it
  const compareCarWithAlternative = (requestedCar, alternativeCar) => {
    if (!requestedCar || !alternativeCar) {
      return "I'm sorry, I couldn't find a good alternative to suggest.";
    }
    
    return `
I see you're interested in the ${requestedCar.name}. Unfortunately, that model isn't currently in our inventory. 

However, I'd like to suggest the ${alternativeCar.name} which is similar and available right now.

Both vehicles are ${requestedCar.type === alternativeCar.type ? `in the same ${requestedCar.type} category` : `similar, though the ${requestedCar.name} is a ${requestedCar.type} while the ${alternativeCar.name} is a ${alternativeCar.type}`}.

The ${alternativeCar.name} offers these advantages:
${alternativeCar.pros.slice(0, 2).map(pro => `• ${pro}`).join('\n')}

Price-wise, the ${alternativeCar.name} is ${alternativeCar.price < requestedCar.price ? 'more affordable' : 'similarly priced'} at $${alternativeCar.price.toLocaleString()}.

Would you like to learn more about the ${alternativeCar.name}?`;
  };

  const addUserMessage = (text) => {
    setConversation(prev => [...prev, { text, isAi: false }]);
  };

  const addAIMessage = (text) => {
    setConversation(prev => [...prev, { text, isAi: true }]);
    speakText(text);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
      
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(voice => voice.name.includes('Samantha') || voice.name.includes('Google UK English Female'));
          speech.voice = preferredVoice || voices[0];
          
          window.speechSynthesis.speak(speech);
          setIsSpeaking(true);
        });
      } else {
        const preferredVoice = voices.find(voice => voice.name.includes('Samantha') || voice.name.includes('Google UK English Female'));
        speech.voice = preferredVoice || voices[0];
        
        window.speechSynthesis.speak(speech);
        setIsSpeaking(true);
      }
      
      currentSpeechRef.current = speech;
      
      speech.onend = () => {
        setIsSpeaking(false);
        currentSpeechRef.current = null;
      };
    }
  };

  const resetConversation = () => {
    if (isSpeaking && currentSpeechRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setConversation([]);
    setKeywords([]);
    setMatchedCars([]);
    
    setTimeout(() => {
      const greeting = "Hi there! I'm your virtual car assistant. Let's start over. Tell me what kind of car you're looking for, and I'll help you find the perfect match.";
      addAIMessage(greeting);
    }, 500);
  };

  const handleInputMethodChange = (event, newValue) => {
    setInputMethod(newValue);
    if (newValue === 'text' && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() && !isProcessing) {
      processUserInput(textInput.trim());
      setTextInput('');
    }
  };

  // Before rendering a message, ensure it's properly formatted
  const renderMessage = (message) => {
    // If message is an object, convert it to a string representation
    if (typeof message === 'object' && message !== null) {
      // If it's the {category, keyword} object mentioned in the error
      if (message.category && message.keyword) {
        return `${message.category}: ${message.keyword}`;
      }
      // For other objects, convert to JSON string
      return JSON.stringify(message);
    }
    
    // If it's already a string or number, return as is
    return message;
  };

  return (
    <Box sx={{ py: 4, px: 2, ...containerStyle }}>
      <VoiceContainer elevation={3}>
        <PulseCircle isRecording={isRecording} />
        
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 500 }}>
          Vehicle Voice Assistant
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Tell me about your ideal car, and I'll find the perfect match
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={inputMethod} 
            onChange={handleInputMethodChange} 
            centered
            variant="fullWidth"
          >
            <Tab 
              icon={<MicIcon />} 
              iconPosition="start" 
              label="Voice" 
              value="voice" 
              disabled={isProcessing}
            />
            <Tab 
              icon={<KeyboardIcon />} 
              iconPosition="start" 
              label="Text" 
              value="text" 
              disabled={isProcessing}
            />
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
          {keywords.map((keyword, index) => (
            <KeywordChip 
              key={index}
              label={keyword}
              className={matchedCars.length > 0 ? 'active' : ''}
            />
          ))}
        </Box>
        
        <Box 
          ref={conversationRef}
          sx={{ 
            height: '250px', 
            overflowY: 'auto', 
            mb: 3, 
            px: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {conversation.map((message, index) => (
            <ConversationBubble key={index} isAi={message.isAi}>
              <Typography variant="body1">
                {renderMessage(message.text)}
              </Typography>
            </ConversationBubble>
          ))}
        </Box>
        
        {inputMethod === 'voice' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <RecordButton
              isRecording={isRecording}
              onClick={isRecording ? () => recognitionRef.current.stop() : startRecognition}
              disabled={isProcessing || isSpeaking}
              size="large"
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : isRecording ? <StopIcon /> : <MicIcon />}
            </RecordButton>
            
            <IconButton 
              onClick={resetConversation} 
              color="primary"
              disabled={isProcessing || isRecording}
            >
              <ReplayIcon />
            </IconButton>
          </Box>
        )}
        
        {inputMethod === 'text' && (
          <form onSubmit={handleTextSubmit} style={{ width: '100%' }}>
            <InputContainer>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isProcessing}
                inputRef={inputRef}
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        type="submit" 
                        color="primary" 
                        disabled={!textInput.trim() || isProcessing}
                        edge="end"
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <IconButton 
                onClick={resetConversation} 
                color="primary"
                disabled={isProcessing}
                sx={{ ml: 1 }}
              >
                <ReplayIcon />
              </IconButton>
            </InputContainer>
          </form>
        )}
        
        {isSpeaking && (
          <Typography 
            variant="caption" 
            align="center" 
            sx={{ 
              display: 'block', 
              mt: 2, 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            Assistant is speaking...
          </Typography>
        )}
      </VoiceContainer>
    </Box>
  );
};

export default VoiceAssistant;