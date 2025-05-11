import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceAssistant from '../components/ai/VoiceAssistant';
import CarMatchCard from '../components/cars/CarMatchCard';
import { findMatchingCars } from '../services/carService';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const VoiceAssistantPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [keywords, setKeywords] = useState([]);
  const [matchingCars, setMatchingCars] = useState([]);
  const [showCarResults, setShowCarResults] = useState(false);
  
  // Update car recommendations when keywords change
  useEffect(() => {
    if (keywords.length > 0) {
      // Find matching cars
      const matches = findMatchingCars(keywords);
      const availableCars = matches.filter(car => car.inStore);
      
      // Set matching cars and show results only if we found matches
      setMatchingCars(availableCars.slice(0, 3));
      setShowCarResults(availableCars.length > 0);
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        AI Car Assistant
      </Typography>
      
      {/* Main content layout - using flex to center the chat initially */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: showCarResults ? 'space-between' : 'center',
        minHeight: '600px',
        gap: 3
      }}>
        {/* Chat container - animated to move from center to left */}
        <motion.div
          layout
          initial={{ width: isMobile ? '100%' : '60%' }}
          animate={{ 
            width: isMobile ? '100%' : (showCarResults ? '48%' : '60%'),
            marginLeft: isMobile ? 0 : (showCarResults ? 0 : 'auto'),
            marginRight: isMobile ? 0 : (showCarResults ? 0 : 'auto')
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ 
            height: '600px',
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius * 2,
            boxShadow: theme.shadows[1],
            overflow: 'hidden'
          }}
        >
          <VoiceAssistant 
            onKeywordsUpdate={handleKeywordsUpdate} 
            containerStyle={{ height: '100%' }}
          />
        </motion.div>
        
        {/* Car Results - Only show when we have matching cars */}
        <AnimatePresence>
          {showCarResults && (
            <motion.div
              key="car-results"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: isMobile ? '100%' : '48%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ 
                height: '600px',
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: theme.shadows[1],
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider'}}>
                <Typography variant="h6">
                  Recommended Cars
                </Typography>
                {keywords.length > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Based on your preferences
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ 
                overflowY: 'auto', 
                flexGrow: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {matchingCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <CarMatchCard car={car} rank={index + 1} />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
};

export default VoiceAssistantPage;