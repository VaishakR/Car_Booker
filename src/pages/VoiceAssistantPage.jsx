import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceAssistant from '../components/ai/VoiceAssistant';
import CarMatchCard from '../components/cars/CarMatchCard';
import { findMatchingCars } from '../services/carService';

const VoiceAssistantPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [keywords, setKeywords] = useState([]);
  const [matchingCars, setMatchingCars] = useState([]);
  const [showCarResults, setShowCarResults] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const containerRef = useRef(null);
  const containerHeight = "600px"; // Increased from 500px to 600px

  // Update car recommendations when keywords change
  useEffect(() => {
    if (keywords.length > 0) {
      const matches = findMatchingCars(keywords);
      const availableCars = matches.filter(car => car.inStore);
      
      setMatchingCars(availableCars.slice(0, 3));
      
      if (availableCars.length > 0) {
        // Only show results panel if we actually found matches
        setShowCarResults(true);
      }
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
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#fafafa', minHeight: 'calc(100vh - 64px)' }} ref={containerRef}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 600 }}>
          AI Car Assistant
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 3,
          position: 'relative', 
          minHeight: showCarResults && !isMobile ? containerHeight : 'auto'
        }}>
          {/* Voice Assistant - Starts centered, moves to left on keyword match */}
          <motion.div
            initial={false}
            animate={{ 
              width: showCarResults ? (isMobile ? '100%' : '42%') : isMobile ? '100%' : '70%',
              margin: showCarResults ? '0' : '0 auto'
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 30,
              duration: 0.5
            }}
            onAnimationComplete={() => setAnimationComplete(true)}
            style={{ 
              height: !isMobile && showCarResults ? containerHeight : 'auto',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              <VoiceAssistant 
                onKeywordsUpdate={handleKeywordsUpdate} 
                conciseMode={true} 
                containerStyle={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: 'none',
                  borderRadius: 0,
                  m: 0,
                  p: 0
                }}
              />
            </Box>
          </motion.div>
          
          {/* Car Results - Appears on the right with animation */}
          <AnimatePresence>
            {showCarResults && (
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 0 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? 0 : 100 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 30,
                  delay: isMobile ? 0.5 : 0.1
                }}
                style={{ 
                  flexGrow: 1,
                  width: isMobile ? '100%' : '55%',
                  height: !isMobile ? containerHeight : 'auto',
                  overflowY: !isMobile ? 'auto' : 'visible'
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: 'white', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Recommended Cars
                  </Typography>
                  
                  {matchingCars.length > 0 ? (
                    <Box sx={{ 
                      overflowY: 'auto', 
                      flexGrow: 1,
                      pr: 0.5, // Add a little padding to the right for scrollbar spacing
                      '& > div': {
                        // Add consistent spacing between cards
                        '&:not(:last-child)': {
                          mb: 1.5 // Space between cards (use mb instead of marginBottom for consistency)
                        }
                      }
                    }}>
                      {matchingCars.map((car, index) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                        >
                          <CarMatchCard car={car} rank={index + 1} />
                        </motion.div>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                      <Typography variant="body1" color="text.secondary">
                        Tell me more about your preferences to find your ideal car.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
};

export default VoiceAssistantPage;