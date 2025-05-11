import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <Box sx={{      bgcolor: '#0a0a14', 
      pt: 8, 
      pb: 6, 
      mt: 'auto',
      borderTop: '1px solid rgba(255, 184, 0, 0.1)'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  bgcolor: 'primary.main',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Box component="span" sx={{ color: 'black', fontWeight: 'bold' }}>S</Box>
              </Box>
              <Typography 
                className="orbitron"
                variant="h6"                sx={{ 
                  fontWeight: 700, 
                  textShadow: '0 0 10px rgba(255, 184, 0, 0.7)'
                }}
              >
                SIXTSENSE
              </Typography>
            </Box>
            <Typography variant="body2" paragraph sx={{ color: 'text.secondary', maxWidth: 350 }}>
              The future of car rentals powered by AI and cutting-edge technology.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'primary.main' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'primary.main' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'primary.main' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'primary.main' } }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" className="orbitron" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                  COMPANY
                </Typography>
                <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Link 
                    component={RouterLink} 
                    to="/about"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    About Us
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/careers"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Careers
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/blog"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Blog
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/press"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Press
                  </Link>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" className="orbitron" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                  SUPPORT
                </Typography>
                <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Link 
                    component={RouterLink} 
                    to="/help"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Help Center
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/safety"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Safety
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/community"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Community
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/accessibility"
                    color="inherit"
                    underline="none"
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Accessibility
                  </Link>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" className="orbitron" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                  CONTACT
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      123 Future Street, Neo City
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: 'primary.main', mr: 1 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ color: 'primary.main', mr: 1 }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      info@sixtsense.com
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
            © {year} SixtSense. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="inherit" underline="none" sx={{ color: 'text.secondary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ color: 'text.secondary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ color: 'text.secondary', fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;