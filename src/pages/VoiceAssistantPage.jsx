import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, useTheme, useMediaQuery, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import VoiceAssistant from '../components/ai/VoiceAssistant';
import BestMatchCarsList from '../components/cars/BestMatchCarsList';
import { findMatchingCars } from '../services/carService';

const VoiceAssistantPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [keywords, setKeywords] = useState([]);
  const [matchingCars, setMatchingCars] = useState([]);
  
  // Update car recommendations when keywords change
  useEffect(() => {
    if (keywords.length > 0) {
      // Find matching cars
      const matches = findMatchingCars(keywords);
      const availableCars = matches.filter(car => car.inStore);
      setMatchingCars(availableCars);
    } else {
      setMatchingCars([]);
    }
  }, [keywords]);

  // Handle keyword updates from voice assistant
  const handleKeywordsUpdate = (newKeywords) => {
    if (newKeywords && newKeywords.length > 0) {
      setKeywords(prev => {
        // Create a new array with unique values
        const combined = [...prev, ...newKeywords];
        return [...new Set(combined)];
      });
    }
  };

  return (
    <Container 
      maxWidth={false}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        height: 'calc(100vh - 64px)', // Full height minus app bar
        p: { xs: 2, md: 4 },
        pt: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          py: 2,
          mb: 3 // Increased margin now that we removed top cards
        }}
      >
        <Box 
          sx={{ 
            width: 6, 
            height: 40, 
            bgcolor: 'primary.main',
            borderRadius: 1,
            mr: 2,            boxShadow: '0 0 10px rgba(255,184,0,0.8)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '6px',
              height: '20px',
              background: 'linear-gradient(to bottom, #FFB800, transparent)',
              opacity: 0.5,
            }
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{            fontWeight: 800,
            background: 'linear-gradient(to right, #FFFFFF, #FFB800)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            textShadow: '0 0 20px rgba(255,184,0,0.4)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -5,
              left: 0,
              width: '60px',
              height: '2px',
              background: '#00EEFF',
              boxShadow: '0 0 10px rgba(0,238,255,0.8)',
            }
          }}
        >
          AI Automotive Assistant
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 3,
          height: '100%', // Use full height since we've removed the top cards section
          overflow: 'hidden'
        }}
      >
        {/* Chat Window */}
        <Box 
          component={motion.div}
          layout
          initial={{ width: '100%', opacity: 0, scale: 0.95 }}
          animate={{ 
            width: isMobile ? '100%' : matchingCars.length > 0 ? '60%' : '100%',
            opacity: 1,
            scale: 1,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            duration: 0.5
          }}
          sx={{ 
            height: isMobile ? 'calc(50% - 16px)' : '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '6px', // Reduced rounded edges
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, rgba(19,21,31,0.9) 0%, rgba(9,11,16,0.95) 100%)',
            border: '1px solid rgba(0,238,255,0.1)',
            backdropFilter: 'blur(16px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(to right, #00EEFF, transparent)',
            }
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            top: 40, 
            left: 20,
            width: 120,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(77,166,255,0.1) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(16px)',
            zIndex: 0
          }} />
          
          <Box sx={{ 
            position: 'absolute',
            bottom: 40,
            right: 20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(77,166,255,0.08) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(16px)',
            zIndex: 0
          }} />
          
          <VoiceAssistant 
            onKeywordsUpdate={handleKeywordsUpdate} 
            containerStyle={{ 
              height: '100%',
              position: 'relative',
              zIndex: 1 
            }}
            futuristicStyle={true}
          />
        </Box>
        
        {/* Car Results */}
        {matchingCars.length > 0 && (
          <Box 
            component={motion.div}
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isMobile ? '100%' : '40%',
              opacity: 1
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.5,
              delay: 0.2
            }}
            sx={{ 
              height: isMobile ? 'calc(50% - 16px)' : '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '6px', // Reduced rounded edges
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, rgba(19,21,31,0.9) 0%, rgba(9,11,16,0.95) 100%)',
              border: '1px solid rgba(0,238,255,0.1)',
              backdropFilter: 'blur(16px)',
              p: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(to left, #00EEFF, transparent)',
              }
            }}
          >
            <Box sx={{ 
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(16px)',
              zIndex: 0
            }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1 }}>
              
              {/* Divider with futuristic style */}
              <Divider 
                sx={{ 
                  mb: 2, 
                  '&::before, &::after': { 
                    borderTop: '1px solid rgba(0,238,255,0.2)',
                  },
                  '&::before': {
                    width: '20%',
                  },
                  '&::after': {
                    width: '80%',
                  }
                }} 
                textAlign="left"
              >
                <Box 
                  component={motion.div}
                  animate={{ 
                    boxShadow: ['0 0 8px rgba(0,238,255,0.4)', '0 0 16px rgba(0,238,255,0.8)', '0 0 8px rgba(0,238,255,0.4)']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  sx={{ 
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00EEFF 0%, #00BFCC 100%)',
                    boxShadow: '0 0 10px rgba(0,238,255,0.8)',
                  }} 
                />
              </Divider>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}>
                <Typography 
                  variant="subtitle1"
                  component={motion.h3}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  sx={{
                    color: 'primary.main',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      width: '4px',
                      height: '16px',
                      backgroundColor: 'primary.main',
                      marginRight: '8px',
                      boxShadow: '0 0 8px rgba(0,238,255,0.8)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  All Matches
                </Typography>
                <BestMatchCarsList cars={matchingCars} skipTopCars={false} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default VoiceAssistantPage;