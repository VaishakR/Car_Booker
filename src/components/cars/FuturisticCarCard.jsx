import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';

const FuturisticCarCard = ({ car, rank, entryDelay = 0 }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const formattedPrice = car.price.toLocaleString();
  const isElectric = car.features && car.features.includes('electric');
  const isBestMatch = rank === 1;
    // Different entrance animations for each position
  const getAnimation = (rank) => {
    switch (rank) {
      case 1:
        return {
          x: [800, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
        };
      case 2:
        return {
          x: [600, 0],
          opacity: [0, 1],
          scale: [0.85, 1],
        };
      case 3:
        return {
          x: [400, 0],
          opacity: [0, 1],
          scale: [0.8, 1],
        };
      case 4:
        return {
          x: [300, 0],
          opacity: [0, 1],
          scale: [0.75, 1],
        };
      default:
        return {
          x: [100, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
        };
    }  };
    return (    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 12,
        mass: 0.9,
        delay: entryDelay + (rank * 0.15)
      }}      whileHover={{ 
        y: -5, 
        boxShadow: '0 10px 30px rgba(255,184,0,0.3)',
        transition: { duration: 0.2 }
      }}
    >
      <Card sx={{ 
        display: 'flex',
        overflow: 'visible',
        position: 'relative',
        height: '140px',
        border: isBestMatch ? '1px solid' : 'none',        borderColor: 'primary.main',
        background: isBestMatch 
          ? 'linear-gradient(135deg, rgba(255,184,0,0.12) 0%, rgba(204,146,0,0.05) 100%)' 
          : 'linear-gradient(135deg, #13151F 0%, #090B10 100%)'
      }}>        {isBestMatch && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            sx={{ 
              position: 'absolute', 
              top: -15, 
              left: 20, 
              zIndex: 10,              background: 'linear-gradient(135deg, #FFB800 0%, #CC9200 100%)',
              borderRadius: '6px',
              padding: '4px 14px',
              boxShadow: '0 4px 16px rgba(255,184,0,0.6)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <motion.div
              animate={{                boxShadow: [
                  '0 0 0px rgba(255,184,0,0)', 
                  '0 0 10px rgba(255,184,0,0.7)', 
                  '0 0 0px rgba(255,184,0,0)'
                ]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.75rem'
                }}
              >
                Best Match
              </Typography>
            </motion.div>
          </Box>
        )}
        
        {/* Car number indicator with futuristic design */}        <Box 
          component={motion.div}          animate={rank === 1 ? {
            boxShadow: [
              '0 0 0px rgba(255,184,0,0.2)',
              '0 0 12px rgba(255,184,0,0.6)',
              '0 0 0px rgba(255,184,0,0.2)'
            ]
          } : {}}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
          sx={{ 
            position: 'absolute',
            top: 'calc(50% - 20px)',
            left: -15,
            width: 40,
            height: 40,
            borderRadius: rank <= 3 ? '6px' : '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',            background: rank <= 3 
              ? 'linear-gradient(135deg, rgba(255,184,0,0.2) 0%, rgba(16,19,26,0.9) 100%)'
              : 'linear-gradient(135deg, rgba(26, 30, 42, 0.9) 0%, rgba(20, 24, 36, 0.9) 100%)',
            border: '1px solid',
            borderColor: rank === 1 
              ? '#FFB800'
              : rank <= 3 
                ? 'rgba(255,184,0,0.3)' 
                : 'rgba(255,255,255,0.1)',            boxShadow: rank <= 3 
              ? '0 4px 12px rgba(0,0,0,0.4), 0 0 8px rgba(255,184,0,0.2)' 
              : '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 5,
            transform: rank <= 3 ? 'rotate(45deg)' : 'none'
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 800,
              transform: rank <= 3 ? 'rotate(-45deg)' : 'none',              color: rank === 1 
                ? '#FFB800' 
                : rank <= 3 
                  ? 'rgba(255,184,0,0.8)'
                  : 'text.secondary',
              textShadow: rank <= 3 ? '0 0 4px rgba(255,184,0,0.4)' : 'none'
            }}
          >
            {rank}
          </Typography>
        </Box>
        
        <Box 
          component={motion.div}
          animate={{            boxShadow: isBestMatch 
              ? ['0 0 0px rgba(255,184,0,0)', '0 0 20px rgba(255,184,0,0.3)', '0 0 0px rgba(255,184,0,0)'] 
              : 'none'
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          sx={{
            position: 'relative',
            width: 150,
            height: '100%',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            sx={{ 
              width: 130, 
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transform: 'scale(1.2)',
            }}
            image={car.image}
            alt={car.name}
            onError={(e) => {
              e.target.src = "https://www.motortrend.com/uploads/sites/5/2020/03/2020-car-of-the-year-logo-1.jpg";
            }}
          />
          {/* Futuristic overlay elements */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: entryDelay + 0.2 }}
            sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '40%',
              background: 'linear-gradient(to top, rgba(77,166,255,0.1), rgba(77,166,255,0))',
              zIndex: 2,
            }} 
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Futuristic slash decoration */}          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(0,238,255,0.1) 0%, rgba(0,0,0,0) 70%)',
            transform: 'rotate(45deg)',
            zIndex: 1,
          }} />
          
          <CardContent sx={{ p: 2, height: '100%', position: 'relative', zIndex: 2 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 0.5,
                    color: isBestMatch ? 'primary.main' : 'text.primary',
                  }}
                >
                  {car.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    opacity: 0.8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                    fontSize: '0.8rem'
                  }}
                >
                  {car.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {car.features.slice(0, 3).map((feature, idx) => (                    <Chip 
                      key={idx}
                      size="small"
                      label={feature}
                      color="primary"
                      sx={{ 
                        height: '20px', 
                        fontSize: '0.7rem',
                        background: 'rgba(0,238,255,0.15)',
                        border: '1px solid rgba(0,238,255,0.3)',
                        '& .MuiChip-label': { px: 1, color: '#FFFFFF' }
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isElectric ? (
                    <ElectricCarIcon fontSize="small" sx={{ color: 'primary.light', mr: 0.5 }} />
                  ) : (
                    <LocalGasStationIcon fontSize="small" sx={{ color: 'primary.light', mr: 0.5 }} />
                  )}
                  
                  <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
                    {isElectric ? car.specs.range : car.specs.mpg}
                  </Typography>
                  
                  {car.specs.acceleration && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SpeedIcon fontSize="small" sx={{ color: 'primary.light', mr: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        {car.specs.acceleration}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 700, 
                      color: isBestMatch ? 'primary.light' : 'text.primary',
                      mr: 1.5,
                    }}
                  >
                    AED {formattedPrice}
                  </Typography>
                  
                  <Button 
                    size="small" 
                    variant={isBestMatch ? "contained" : "outlined"}
                    onClick={() => navigate(`/car/${car.id}`)}
                    sx={{ 
                      minWidth: 0,
                      minHeight: 0,
                      py: 0.3, 
                      px: 1.5,
                      fontSize: '0.7rem',
                      borderRadius: '6px',
                    }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </motion.div>
  );
};

export default FuturisticCarCard;