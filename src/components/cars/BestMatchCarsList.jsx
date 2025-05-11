import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  useTheme,
  Grid,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FuturisticCarCard from './FuturisticCarCard';

const BestMatchCarsList = ({ cars = [], skipTopCars = true }) => {
  const theme = useTheme();
  const [displayedCars, setDisplayedCars] = useState([]);
  // Skip the first 3 cars (shown in TopMatchCarCards) and show the next 4
  const bestMatches = skipTopCars ? cars.slice(3, 7) : cars.slice(0, 4);

  useEffect(() => {
    // Reset the displayed cars when the input changes
    setDisplayedCars([]);
    
    // Add each car to displayed cars with a delay for animation
    const timer = setTimeout(() => {
      if (bestMatches.length > 0) {
        const timers = bestMatches.map((car, index) => {
          return setTimeout(() => {
            setDisplayedCars(prev => [...prev, car]);
          }, index * 400); // Stagger each car by 400ms
        });
        
        return () => timers.forEach(t => clearTimeout(t));
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [cars]);
  
  // Define animation variants for the section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  if (bestMatches.length === 0) {
    return null;
  }

  return (
    <Box sx={{ pb: 4 }}>    <Typography 
        variant="h5" 
        component={motion.h5}        animate={{ 
          color: ['#FFB800', '#FFCF40', '#FFB800'],
          textShadow: ['0 0 5px rgba(255, 184, 0, 0.3)', '0 0 8px rgba(255, 184, 0, 0.5)', '0 0 5px rgba(255, 184, 0, 0.3)']
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        sx={{            color: '#FFB800',
          fontWeight: 700,
          mb: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '1.2rem',
          textShadow: '0 0 8px rgba(255,184,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            display: 'block',
            width: '3px',
            height: '20px',            backgroundColor: 'primary.main',
            marginRight: '12px',
            boxShadow: '0 0 8px rgba(255,184,0,0.8)',
          }
        }}
      >
        {skipTopCars ? 'More Matches' : 'Best Matches'}
      </Typography>        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ mt: 2 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {displayedCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, x: 200, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 12,
                  delay: index * 0.1, 
                }}
                style={{ marginBottom: '16px' }}
              >
                <FuturisticCarCard 
                  car={car} 
                  rank={skipTopCars ? index + 4 : index + 1} 
                  entryDelay={0.3} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
      </Box>
    </Box>
  );
};

export default BestMatchCarsList;