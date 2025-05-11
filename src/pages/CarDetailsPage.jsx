import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Chip, 
  Divider,
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { getCarById } from '../services/carService';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = getCarById(parseInt(id, 10));

  if (!car) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Car Not Found
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Cars
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/')}
        sx={{ mb: 4 }}
      >
        Back to Cars
      </Button>
        <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box 
            component="img"
            src={car.image || `/assets/cars/${car.image}`}
            alt={car.name}
            onError={(e) => {
              e.target.src = '/assets/cars/default-car.jpg';
            }}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              mb: { xs: 2, md: 0 } 
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={7}>          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {car.name}
            </Typography>
            {!car.inStore && (
              <Chip label="Out of Stock" color="error" sx={{ fontWeight: 500 }} />
            )}
          </Box>
          
          <Typography variant="h5" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
            AED {car.price.toLocaleString()}
          </Typography>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
            {car.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, gap: 0.5 }}>
            {car.features.map((feature, index) => (
              <Chip 
                key={index} 
                label={feature} 
                size="small" 
                sx={{ 
                  height: '24px', 
                  fontSize: '0.7rem',
                  '& .MuiChip-label': { px: 1 }
                }} 
              />
            ))}
          </Box>
          
          <Button 
            variant="contained"
            size="medium"
            fullWidth
            disabled={!car.inStore}
            sx={{ mb: 2 }}
          >
            {car.inStore ? 'Rent Now' : 'Currently Unavailable'}
          </Button>
            <Divider sx={{ my: 1.5 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Specifications
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {Object.entries(car.specs).map(([key, value]) => (
              <Grid item xs={4} key={key}>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    {key.replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 1.5 }} />
            <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#f9f9f9' }} variant="outlined">
                <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main', mb: 0.5 }}>
                    Pros
                  </Typography>
                  <List dense disablePadding>
                    {car.pros.map((pro, index) => (
                      <ListItem key={index} sx={{ py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckIcon sx={{ fontSize: 16 }} color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={pro} 
                          primaryTypographyProps={{ variant: 'body2' }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#f9f9f9' }} variant="outlined">
                <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main', mb: 0.5 }}>
                    Cons
                  </Typography>
                  <List dense disablePadding>
                    {car.cons.map((con, index) => (
                      <ListItem key={index} sx={{ py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CloseIcon sx={{ fontSize: 16 }} color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={con}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CarDetailsPage;