import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <Box sx={{ bgcolor: '#f5f5f5', pt: 6, pb: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: '1.5rem',
                letterSpacing: '-0.5px'
              }}
            >
              RENTAL
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 300 }}>
              Find your perfect car with our AI-powered rental service. We offer a wide range of vehicles to meet all your driving needs.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                component={RouterLink} 
                to="/"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink} 
                to="/vehicles"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Vehicles
              </Link>
              <Link 
                component={RouterLink} 
                to="/how-it-works"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                How It Works
              </Link>
              <Link 
                component={RouterLink} 
                to="/about"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                About Us
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Vehicle Types
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                component={RouterLink} 
                to="/vehicles?type=sedan"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Sedans
              </Link>
              <Link 
                component={RouterLink} 
                to="/vehicles?type=suv"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                SUVs
              </Link>
              <Link 
                component={RouterLink} 
                to="/vehicles?type=electric"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Electric
              </Link>
              <Link 
                component={RouterLink} 
                to="/vehicles?type=luxury"
                color="inherit"
                underline="none"
                sx={{ mb: 1, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Luxury
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              123 Rental Street, Carville, CV 12345
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: info@rental.com
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Phone: (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'space-between' }, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            © {year} RENTAL. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', mt: { xs: 2, md: 0 }, justifyContent: 'center', width: { xs: '100%', md: 'auto' } }}>
            <Link href="#" color="inherit" underline="none" sx={{ mx: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ mx: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ mx: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;