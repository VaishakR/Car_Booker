import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

const CarCard = ({ car, compact = false }) => {
  const navigate = useNavigate();
  
  // Determine if car has electric in features
  const isElectric = car.features && car.features.includes('electric');
  
  // Format price with commas
  const formattedPrice = car.price.toLocaleString();
  
  // Get relevant spec info
  const getSpecInfo = () => {
    if (isElectric && car.specs.range) {
      return { icon: <ElectricCarIcon fontSize="small" />, text: car.specs.range };
    } else if (car.specs.mpg) {
      return { icon: <LocalGasStationIcon fontSize="small" />, text: car.specs.mpg };
    } else {
      return null;
    }
  };
  
  const specInfo = getSpecInfo();
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="car-card"
    >
      <Card 
        sx={{ 
          height: compact ? '100%' : '100%',
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          backgroundColor: 'rgba(25, 29, 40, 0.8)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 184, 0, 0.2)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            boxShadow: '0 15px 30px rgba(255, 184, 0, 0.2)',
            transform: 'translateY(-10px)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height={compact ? 100 : 200}
            image={car.image || `/assets/cars/${car.id}.jpg`}
            alt={car.name}
            onError={(e) => {
              e.target.src = '/assets/cars/default-car.jpg';
            }}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              bgcolor: car.inStore ? 'rgba(0, 255, 255, 0.9)' : 'error.main',
              color: 'black',
              px: 2,
              py: 0.5,
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            {car.inStore ? 'AVAILABLE' : 'OUT OF STOCK'}
          </Box>
        </Box>
        
        <CardContent sx={{ 
          flexGrow: 1,
          p: 3
        }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: "'Orbitron', sans-serif",
                    mb: 0.5
                  }}
                >
                  {car.name.toUpperCase()}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  {car.type}
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  color: 'primary.main',                fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                AED {formattedPrice}<Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}></Typography>
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {car.features && car.features.slice(0, 3).map((feature, index) => (
              <Chip 
                key={index}
                label={feature}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(10, 10, 10, 0.8)',
                  color: 'text.secondary',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  height: '24px'
                }}
              />
            ))}
          </Box>
          
          {!compact && (
            <Button 
              fullWidth
              variant="contained"
              color="primary"
              className="cyber-button"
              sx={{ 
                py: 1.5, 
                mt: 'auto',
                fontWeight: 'bold',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
              onClick={() => navigate(`/car/${car.id}`)}
              startIcon={<CalendarIcon />}
            >
              RESERVE NOW
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarCard;