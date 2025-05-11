import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VoiceAssistant from '../components/ai/VoiceAssistant';
import CarList from '../components/cars/CarList';
import { getAvailableCars } from '../services/carService';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [cars] = useState(getAvailableCars().slice(0, 6)); // Just show first 6 for the homepage

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: 'easeOut' 
      } 
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(to right, #f5f5f5, #e0e0e0)',
          py: { xs: 8, md: 12 },
          mb: 6
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={heroVariants}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    letterSpacing: '-0.5px'
                  }}
                >
                  Find Your Perfect Ride
                </Typography>
                
                <Typography 
                  variant="h5" 
                  color="text.secondary"
                  sx={{ mb: 4, fontWeight: 400 }}
                >
                  Talk to our AI assistant and discover the ideal car for your needs
                </Typography>
                
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/voice-assistant')}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: '10px',
                  }}
                >
                  Start Voice Assistant
                </Button>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box 
                  component="img"
                  src="/assets/hero-car.png" 
                  alt="Luxury car"
                  sx={{ 
                    width: '100%', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Voice Assistant */}
      {showVoiceAssistant && (
        <Container sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VoiceAssistant />
          </motion.div>
        </Container>
      )}

      {/* Featured Cars Section */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 600,
              mb: 2
            }}
          >
            Featured Vehicles
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: '1.1rem'
            }}
          >
            Explore our selection of premium vehicles available for immediate rental
          </Typography>
        </Box>
        
        <CarList cars={cars} />
      </Container>
      
      {/* How It Works Section */}
      <Box 
        sx={{ 
          backgroundColor: '#f9f9f9', 
          py: 8,
          mb: 8
        }}
      >
        <Container>
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            How It Works
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box 
                    component="img"
                    src="/assets/icons/mic-icon.svg"
                    alt="Voice Assistant"
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                    Talk to Our AI
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Share your preferences and let our voice assistant find the perfect vehicle for you
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box 
                    component="img"
                    src="/assets/icons/car-icon.svg"
                    alt="Choose Car"
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                    Select Your Vehicle
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Browse our recommendations and choose a vehicle that fits your needs
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box 
                    component="img"
                    src="/assets/icons/key-icon.svg"
                    alt="Get Keys"
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                    Drive Away
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Complete the booking and hit the road in your perfect rental car
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;