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
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: compact ? 'row' : 'column',
          position: 'relative',
        }}
      >
        {!car.inStore && (
          <Chip 
            label="Out of Stock" 
            color="error" 
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              zIndex: 1
            }}
          />
        )}
        
        <CardMedia
          component="img"
          height={compact ? 100 : 160}
          width={compact ? 100 : 'auto'}
          image={car.image || `/assets/cars/${car.image}`}
          alt={car.name}
          onError={(e) => {
            e.target.src = '/assets/cars/default-car.jpg';
          }}
          sx={{ 
            objectFit: 'cover',
            width: compact ? 100 : '100%'
          }}
        />
        
        <CardContent sx={{ flexGrow: 1, p: compact ? 1.5 : 3 }}>
          <Typography variant={compact ? "body1" : "h6"} gutterBottom sx={{ fontWeight: 600 }}>
            {car.name}
          </Typography>
          
          {!compact && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                height: '40px'
              }}
            >
              {car.description}
            </Typography>
          )}
          
          {!compact && (
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ mb: 2 }}
            >
              {car.type && (
                <Chip 
                  label={car.type} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                  sx={{ borderRadius: '4px' }}
                />
              )}
              
              {car.features && car.features.length > 0 && (
                <Chip 
                  label={car.features[0]} 
                  size="small"
                  sx={{ borderRadius: '4px', backgroundColor: '#f5f5f5' }}
                />
              )}
            </Stack>
          )}
          
          {compact ? (
            // Simplified version for compact mode
            <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                ${formattedPrice}
              </Typography>
              
              <Chip 
                label={car.type} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            </Box>
          ) : (
            // Full version for normal mode
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}
            >
              {car.specs.acceleration && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <SpeedIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {car.specs.acceleration}
                  </Typography>
                </Box>
              )}
              
              {car.specs.seating && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AirlineSeatReclineNormalIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {car.specs.seating} seats
                  </Typography>
                </Box>
              )}
              
              {specInfo && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {specInfo.icon}
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {specInfo.text}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          {!compact && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pt: 1,
                borderTop: '1px solid #f0f0f0'
              }}
            >
              <Typography 
                variant="h6" 
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                ${formattedPrice}
              </Typography>
              
              <Button 
                variant="outlined"
                size="small"
                disabled={!car.inStore}
                onClick={() => navigate(`/car/${car.id}`)}
              >
                {car.inStore ? 'View Details' : 'Out of Stock'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarCard;