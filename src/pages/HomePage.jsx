import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VoiceAssistant from '../components/ai/VoiceAssistant';
import CarList from '../components/cars/CarList';
import { getAvailableCars } from '../services/carService';
import { Mic as MicIcon, DirectionsCar as CarIcon, VpnKey as KeyIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [cars] = useState(getAvailableCars().slice(0, 3)); // Show first 3 for featured vehicles

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

  const toggleVoiceAssistant = () => {
    setShowVoiceAssistant(!showVoiceAssistant);
  };

  return (
    <Box>
      {/* Hero Section with Video Background */}
      <Box 
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          height: '90vh',
          minHeight: '500px'
        }}
      >
        {/* Dark overlay */}
        <Box 
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 10
          }}
        />

        {/* Video background - using placeholder color until we have a video */}
        <Box 
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(45deg, #090B10 0%, #13151F 100%)',
            zIndex: 5
          }}
        >
          {/* If you have an actual video file, replace this with a video element */}
        </Box>

        {/* Hero content */}
        <Container 
          sx={{ 
            position: 'relative',
            zIndex: 20,
            height: '100%',
            py: { xs: 8, md: 12 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={7}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={heroVariants}
              >
                <Typography 
                  className="orbitron"
                  variant="h1" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '5rem' },
                    mb: 2,
                    textShadow: '0 0 10px rgba(255, 184, 0, 0.7)',
                    letterSpacing: '0.05em',
                  }}
                >
                  FUTURE OF <span style={{ color: theme.palette.primary.main }}>MOBILITY</span>
                </Typography>
                
                <Typography 
                  variant="h5" 
                  color="text.secondary"
                  sx={{ mb: 4, fontWeight: 400 }}
                >
                  Experience the next generation of car rentals with our AI-powered platform and premium vehicle selection.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={toggleVoiceAssistant}
                    className="cyber-button"
                    sx={{ 
                      py: 2, 
                      px: 4,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontWeight: 'bold'
                    }}
                    startIcon={<MicIcon />}
                  >
                    VOICE ASSISTANT
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/vehicles')}
                    sx={{ 
                      py: 2, 
                      px: 4,
                      fontSize: '1rem',
                      border: `2px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'black',
                        border: `2px solid ${theme.palette.primary.main}`,
                      }
                    }}
                  >
                    BROWSE CARS
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
        
        {/* Gradient at the bottom of the hero section */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: '16px', 
            background: 'linear-gradient(to top, #000000, transparent)',
            zIndex: 15
          }}
        />
      </Box>

      {/* Voice Assistant Section */}
      <Box 
        sx={{ 
          py: 10, 
          px: 2,
          backgroundColor: 'black',
          display: showVoiceAssistant ? 'block' : 'none'
        }}
      >
        <Container>
          <Typography 
            variant="h2" 
            className="orbitron" 
            align="center"            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255, 184, 0, 0.7)',
            }}
          >
            AI VOICE <span style={{ color: theme.palette.primary.main }}>ASSISTANT</span>
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              color: 'gray.400', 
              mb: 8, 
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Our advanced AI will help you find the perfect vehicle tailored to your needs through natural conversation.
          </Typography>
            <Box 
            className="voice-assistant"
            sx={{ 
              borderRadius: 4,
              p: 4,
              maxWidth: '900px',
              mx: 'auto',
              backgroundColor: theme.palette.background.paper,
              border: '1px solid',
              borderColor: 'rgba(255, 184, 0, 0.5)',
              boxShadow: '0 0 30px rgba(255, 184, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 3 }}>
                <Box 
                  className="pulse"
                  sx={{ 
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 184, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 184, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MicIcon sx={{ fontSize: '4rem', color: theme.palette.primary.main }} />
                  </Box>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: theme.palette.primary.main,
                      color: 'black',
                      fontWeight: 'bold',
                      px: 3,
                      py: 0.5,
                      borderRadius: '20px',
                    }}
                  >
                    ONLINE
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <VoiceAssistant futuristicStyle={true} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Featured Cars Section */}
      <Box 
        sx={{ 
          py: 10,
          background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        }}
      >
        <Container>
          <Box sx={{ mb: 8, textAlign: 'center' }}>            <Typography 
              variant="h2" 
              className="orbitron"
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 0 10px rgba(255, 184, 0, 0.7)',
              }}
            >
              FEATURED <span style={{ color: theme.palette.primary.main }}>VEHICLES</span>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto',
                mb: 4,
                color: 'text.secondary',
              }}
            >
              Explore our selection of premium vehicles available for immediate rental
            </Typography>
          </Box>
          
          <CarList cars={cars} />

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined"
              onClick={() => navigate('/vehicles')}
              sx={{ 
                py: 2, 
                px: 6,
                fontSize: '1rem',
                border: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'black',
                  border: `2px solid ${theme.palette.primary.main}`,
                }
              }}
            >
              VIEW ALL VEHICLES
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box 
        sx={{ 
          backgroundColor: 'black', 
          py: 10,
        }}
      >
        <Container>
          <Typography 
            variant="h2" 
            className="orbitron" 
            align="center" 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 0 10px rgba(0, 255, 255, 0.7)',
            }}
          >
            HOW IT <span style={{ color: theme.palette.primary.main }}>WORKS</span>
          </Typography>          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              color: 'gray.400', 
              mb: 6, 
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Renting your dream car has never been easier with our futuristic platform
          </Typography>
          
          {/* Responsive grid container */}
          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* Step 1 */}
            <Grid item xs={12} sm={4} sx={{ display: 'flex' }}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ width: '100%' }}
              >
                <Box 
                  sx={{ 
                    bgcolor: theme.palette.background.paper, 
                    p: { xs: 2, md: 3 },
                    borderRadius: 2,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    className="hexagon"
                    sx={{
                      bgcolor: 'rgba(0, 255, 255, 0.2)',                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <MicIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" className="orbitron" gutterBottom sx={{ fontWeight: 'bold' }}>
                    1. TALK TO AI
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.85rem' }}>
                    Start a conversation with our AI assistant to find the perfect vehicle for your needs.
                  </Typography>
                  <Box
                    sx={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'black',
                      fontWeight: 'bold',
                      mt: 'auto'
                    }}
                  >
                    1
                  </Box>
                </Box>
              </motion.div>
            </Grid>              {/* Step 2 */}
            <Grid item xs={12} sm={4} sx={{ display: 'flex' }}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ width: '100%' }}
              >
                <Box 
                  sx={{ 
                    bgcolor: theme.palette.background.paper, 
                    p: { xs: 2, md: 3 }, 
                    borderRadius: 2,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    className="hexagon"
                    sx={{
                      bgcolor: 'rgba(0, 255, 255, 0.2)',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',                      justifyContent: 'center',
                      mb: 2
                    }}
                  >                    <CarIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" className="orbitron" gutterBottom sx={{ fontWeight: 'bold' }}>
                    2. SELECT VEHICLE
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.85rem' }}>
                    Browse through our curated selection of premium vehicles and choose your favorite.
                  </Typography>
                  <Box
                    sx={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'black',
                      fontWeight: 'bold',
                      mt: 'auto'
                    }}
                  >
                    2
                  </Box>
                </Box>
              </motion.div>
            </Grid>
              {/* Step 3 */}
            <Grid item xs={12} sm={4} sx={{ display: 'flex' }}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ width: '100%' }}
              >
                <Box 
                  sx={{ 
                    bgcolor: theme.palette.background.paper, 
                    p: { xs: 2, md: 3 }, 
                    borderRadius: 2,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    className="hexagon"
                    sx={{
                      bgcolor: 'rgba(0, 255, 255, 0.2)',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >                    <KeyIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" className="orbitron" gutterBottom sx={{ fontWeight: 'bold' }}>
                    3. DRIVE AWAY
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.85rem' }}>
                    Complete the digital paperwork and pick up your vehicle at your convenience.
                  </Typography>
                  <Box
                    sx={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'black',
                      fontWeight: 'bold',
                      mt: 'auto'
                    }}
                  >
                    3
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 15, 
          px: 2,
          bgcolor: 'black',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #00EEFF, #5689f5)',
              animation: 'pulse 2s infinite'
            }}
          />
        </Box>
        <Container sx={{ position: 'relative', zIndex: 10 }}>
          <Box sx={{ maxWidth: '900px', mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              className="orbitron" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                textShadow: '0 0 10px rgba(0, 255, 255, 0.7)',
              }}
            >
              READY FOR THE <span style={{ color: theme.palette.primary.main }}>FUTURE</span> OF MOBILITY?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6,
                color: 'text.secondary'
              }}
            >
              Join thousands of satisfied customers experiencing the next generation of car rentals.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={toggleVoiceAssistant}
                className="cyber-button"
                sx={{ 
                  py: 2, 
                  px: 4,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 'bold',
                  borderRadius: '50px'
                }}
                startIcon={<MicIcon />}
              >
                TALK TO AI ASSISTANT
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/vehicles')}
                sx={{ 
                  py: 2, 
                  px: 4,
                  fontSize: '1rem',
                  border: `2px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  borderRadius: '50px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'black',
                    border: `2px solid ${theme.palette.primary.main}`,
                  }
                }}
              >
                BROWSE ALL VEHICLES
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;