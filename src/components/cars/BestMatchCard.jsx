import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Chip, 
  Stack, 
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useNavigate } from 'react-router-dom';

const BestMatchCard = ({ car, compact = false }) => {
  const navigate = useNavigate();
  
  // Format price with commas
  const formattedPrice = car.price.toLocaleString();
  
  // Determine if car has electric in features
  const isElectric = car.features && car.features.includes('electric');
  
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
    <Card 
      elevation={2}
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        border: '2px solid',
        borderColor: 'primary.light',
      }}
    >
      <Grid container direction={compact ? 'column' : 'row'}>
        <Grid item xs={12} md={compact ? 12 : 5}>
          <CardMedia
            component="img"
            height={compact ? 180 : 250}
            image={car.image || `/assets/cars/${car.image}`}
            alt={car.name}
            onError={(e) => {
              e.target.src = '/assets/cars/default-car.jpg';
            }}
            sx={{ objectFit: 'cover' }}
          />
          
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            left: 16, 
            bgcolor: 'primary.main', 
            color: 'white', 
            px: 2, 
            py: 0.5, 
            borderRadius: 1,
            fontWeight: 600,
            fontSize: '0.875rem'
          }}>
            Best Match
          </Box>
        </Grid>
        
        <Grid item xs={12} md={compact ? 12 : 7}>
          <CardContent sx={{ p: compact ? 2 : 3 }}>
            <Typography variant={compact ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 600 }}>
              {car.name}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
              sx={{ mb: 2 }}
            >
              {compact ? car.description.substring(0, 80) + '...' : car.description}
            </Typography>
            
            <Typography 
              variant="h5" 
              color="primary"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              AED {formattedPrice}
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ mb: compact ? 2 : 3, flexWrap: 'wrap', gap: 1 }}
            >
              {car.features.slice(0, compact ? 3 : 5).map((feature, index) => (
                <Chip 
                  key={index} 
                  label={feature} 
                  size="small"
                  color={index === 0 ? 'primary' : 'default'}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Stack>
            
            {!compact && (
              <>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}
                >
                  {car.specs.acceleration && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <SpeedIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {car.specs.acceleration}
                      </Typography>
                    </Box>
                  )}
                  
                  {car.specs.seating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <AirlineSeatReclineNormalIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {car.specs.seating} seats
                      </Typography>
                    </Box>
                  )}
                  
                  {specInfo && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {specInfo.icon}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {specInfo.text}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <List dense sx={{ mb: 2 }}>
                  {car.pros.slice(0, 3).map((pro, index) => (
                    <ListItem key={index} sx={{ p: 0, mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={pro} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            <Button 
              variant="contained"
              size={compact ? "medium" : "large"}
              onClick={() => navigate(`/car/${car.id}`)}
              sx={{ width: '100%' }}
            >
              View Details
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BestMatchCard;