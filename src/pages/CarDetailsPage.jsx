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
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              {car.name}
            </Typography>
            {!car.inStore && (
              <Chip label="Out of Stock" color="error" sx={{ fontWeight: 500 }} />
            )}
          </Box>
          
          <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 700 }}>
            ${car.price.toLocaleString()}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {car.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, gap: 1 }}>
            {car.features.map((feature, index) => (
              <Chip key={index} label={feature} size="medium" />
            ))}
          </Box>
          
          <Button 
            variant="contained"
            size="large"
            fullWidth
            disabled={!car.inStore}
            sx={{ mb: 3 }}
          >
            {car.inStore ? 'Rent Now' : 'Currently Unavailable'}
          </Button>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Specifications
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(car.specs).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1, textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', bgcolor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pros
                  </Typography>
                  <List dense>
                    {car.pros.map((pro, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={pro} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', bgcolor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cons
                  </Typography>
                  <List dense>
                    {car.cons.map((con, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CloseIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={con} />
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