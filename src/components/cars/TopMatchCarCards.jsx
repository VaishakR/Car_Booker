import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  Typography, 
  Button, 
  IconButton,
  Modal,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TopMatchCarCards = ({ cars = [] }) => {
  const navigate = useNavigate();
  const topCars = cars.slice(0, 3);
  const [selectedCar, setSelectedCar] = useState(null);
  
  if (topCars.length === 0) {
    return null;
  }
  
  const handleViewDetails = (car) => {
    setSelectedCar(car);
  };
  
  const handleCloseDetails = () => {
    setSelectedCar(null);
  };
  
  const handleNavigateToCarDetail = (carId) => {
    navigate(`/car/${carId}`);
  };
  
  // Format year from car name (assuming format includes year like "2023 Tesla Model S")
  const getYearFromName = (name) => {
    const yearMatch = name.match(/^(20\d\d)\s/);
    return yearMatch ? yearMatch[1] : "2025"; // Default to current year if not found
  };
  
  const isElectric = (car) => {
    return car.features && car.features.includes('electric');
  };

  return (
    <>
      <Box
        sx={{ 
          display: 'flex',
          justifyContent: 'center', 
          width: '100%',
          gap: { xs: 1, sm: 2, md: 3 },
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}
      >
        {topCars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.15,
              type: 'spring',
              stiffness: 300,
              damping: 24,
            }}
            style={{ 
              flexBasis: { xs: '100%', sm: '45%', md: '33%' },
              minWidth: '240px',
              maxWidth: '300px',
            }}
          >
            <Card
              component={motion.div}              whileHover={{ 
                y: -8, 
                boxShadow: '0 12px 20px rgba(0,0,0,0.6), 0 0 15px rgba(255,184,0,0.3)' 
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              sx={{
                width: '100%',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #13151F 0%, #090B10 100%)',                border: '1px solid rgba(255,184,0,0.15)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(255,184,0,0.4), transparent)',
                }
              }}
              onClick={() => handleViewDetails(car)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={car.image || `/assets/cars/${car.id}.jpg`}
                  alt={car.name}
                  sx={{
                    height: '160px',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)'
                    }
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/cars/default-car.jpg';
                  }}
                />
                
                <Box 
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    py: 0.5,
                    px: 1.5,
                    borderRadius: '50px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  {car.inStore ? 'AVAILABLE' : 'OUT OF STOCK'}
                </Box>
                
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    background: 'linear-gradient(to top, #090B10, transparent)',
                  }}
                />
              </Box>
              
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="subtitle1"
                    className="orbitron"
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      mb: 0
                    }}
                  >
                    {car.name.split(' ').slice(1).join(' ')}
                  </Typography>
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    AED {car.price}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap', 
                    mt: 1 
                  }}
                >
                  {car.features && car.features.slice(0, 2).map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(0, 238, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.65rem',
                        height: '22px'
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(to right, #00EEFF, transparent)',
                  opacity: 0.6
                }}
              />
            </Card>
          </motion.div>
        ))}
      </Box>
      
      <Modal
        open={!!selectedCar}
        onClose={handleCloseDetails}
        aria-labelledby="car-details-modal"
        aria-describedby="detailed view of selected car"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          sx={{
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #13151F 0%, #090B10 100%)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,238,255,0.2)',
            border: '1px solid rgba(0,238,255,0.2)',
            p: 0,
            position: 'relative',
          }}
        >
          {selectedCar && (
            <>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={handleCloseDetails}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    zIndex: 2,
                    '&:hover': {
                      bgcolor: 'rgba(0,238,255,0.2)',
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
                
                <CardMedia
                  component="img"
                  image={selectedCar.image || `/assets/cars/${selectedCar.id}.jpg`}
                  alt={selectedCar.name}
                  sx={{
                    height: '250px',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/cars/default-car.jpg';
                  }}
                />
                
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    background: 'linear-gradient(to top, #090B10, transparent)',
                  }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <Typography
                    variant="h4"
                    className="orbitron"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      mb: 1
                    }}
                  >
                    {selectedCar.name.split(' ').slice(1).join(' ')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      size="small"
                      label={getYearFromName(selectedCar.name)}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'black',
                        fontWeight: 'bold'
                      }}
                    />
                    
                    <Chip
                      size="small"
                      label={selectedCar.type || 'Luxury'}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                    
                    {isElectric(selectedCar) && (
                      <Chip
                        size="small"
                        icon={<ElectricCarIcon sx={{ color: '#00EEFF !important', fontSize: '0.9rem' }} />}
                        label="Electric"
                        sx={{
                          bgcolor: 'rgba(0,238,255,0.2)',
                          color: 'primary.main',
                          '& .MuiChip-label': {
                            pl: 0.5
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {selectedCar.description}
                  </Typography>
                </Box>
                
                <Divider sx={{ 
                  my: 2,
                  '&::before, &::after': {
                    borderColor: 'rgba(0,238,255,0.2)'
                  }
                }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }}
                  >
                    SPECIFICATIONS
                  </Typography>
                </Divider>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {selectedCar.specs && Object.entries(selectedCar.specs).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            bgcolor: 'rgba(0,238,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1
                          }}
                        >
                          {key === 'acceleration' ? (
                            <SpeedIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                          ) : key === 'range' ? (
                            <ElectricCarIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                          ) : key === 'mpg' ? (
                            <LocalGasStationIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                          ) : (
                            <CheckIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {key.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {value}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }}
                  >
                    AED {selectedCar.price}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                      
                    </Typography>
                  </Typography>
                  
                  <Button
                    variant="contained"
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => handleNavigateToCarDetail(selectedCar.id)}
                    sx={{
                      px: 3,
                      boxShadow: '0 5px 10px rgba(0,0,0,0.2), 0 0 10px rgba(0,238,255,0.2)',
                      background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
                      }
                    }}
                  >
                    Reserve Now
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TopMatchCarCards;
