import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  useTheme,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CarMatchCard = ({ car, rank }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Format price with commas
  const formattedPrice = car.price.toLocaleString();
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: theme.shadows[8] }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ marginBottom: '12px' }} // Reduced space between cards
    >
      <Card 
        sx={{ 
          display: 'flex',
          borderRadius: 3, // Increased border radius for more curved edges
          overflow: 'hidden',
          position: 'relative',
          border: rank === 1 ? `2px solid ${theme.palette.primary.main}` : 'none',
          height: '140px', // Slightly reduced height to make it more rectangular
        }}
      >
        {rank === 1 && (
          <Box sx={{ 
            position: 'absolute', 
            top: 5, 
            left: 5, 
            zIndex: 2,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1,
            py: 0.3,
            borderRadius: 1,
            fontSize: '0.65rem',
            fontWeight: 600
          }}>
            Best Match
          </Box>
        )}
        
        <CardMedia
          component="img"
          sx={{ 
            width: 120, 
            height: '100%', 
            objectFit: 'contain', // Change from 'cover' to 'contain'
            backgroundColor: '#f5f5f5', // Light gray background to make transparent images visible
            padding: '4px' // Add some padding to prevent image from touching edges
          }}
          image={car.image}
          alt={car.name}
          onError={(e) => {
            // Use a default image URL if the car image fails to load
            e.target.src = "https://www.motortrend.com/uploads/sites/5/2020/03/2020-car-of-the-year-logo-1.jpg";
          }}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <CardContent sx={{ flex: '1 0 auto', p: 1, pb: 0.5 }}> 
            <Typography 
              variant="subtitle1"
              component="div" 
              sx={{ 
                fontWeight: 600, 
                mb: 0.3,
                fontSize: '0.9rem'
              }}
            >
              {car.name}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 700 }}
              >
                AED {formattedPrice}
              </Typography>
              
              <Chip 
                label={car.type} 
                size="small"
                sx={{ 
                  textTransform: 'capitalize', 
                  bgcolor: 'grey.100',
                  height: '18px',
                  fontSize: '0.65rem'
                }}
              />
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 0.5,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                fontSize: '0.75rem'
              }}
            >
              {car.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3, mb: 0.5 }}>
              {car.features.slice(0, 3).map((feature, idx) => (
                <Chip 
                  key={idx}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.65rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { px: 0.5 }
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.3 }}>
              <Button 
                size="small" 
                variant="contained"
                onClick={() => navigate(`/car/${car.id}`)}
                sx={{ 
                  py: 0,
                  minHeight: '24px',
                  minWidth: '82px', // Slightly smaller width
                  fontSize: '0.65rem', // Slightly smaller text
                  borderRadius: 1.5 // More rounded corners on button
                }}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </motion.div>
  );
};

export default CarMatchCard;