import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };
  
  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 184, 0, 0.1)',
        boxShadow: '0 0 20px rgba(255, 184, 0, 0.3)'
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box 
              sx={{ 
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                bgcolor: 'primary.main',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}
            >
              <Box component="span" sx={{ color: 'black', fontWeight: 'bold' }}>S</Box>
            </Box>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 800,
                fontSize: '1.5rem',
                fontFamily: "'Orbitron', sans-serif",                color: '#FFFFFF',
                textDecoration: 'none',
                textShadow: '0 0 10px rgba(255, 184, 0, 0.7)',
                letterSpacing: '0.05em',
              }}
            >
              SIXTSENSE
            </Typography>
          </Box>
          
          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="open menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: 'rgba(9, 11, 16, 0.95)',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 238, 255, 0.2)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                    mt: 1
                  }
                }}
              >
                <MenuItem onClick={() => handleNavigate('/')}>Home</MenuItem>
                <MenuItem onClick={() => handleNavigate('/vehicles')}>Vehicles</MenuItem>
                <MenuItem onClick={() => handleNavigate('/services')}>Services</MenuItem>
                <MenuItem onClick={() => handleNavigate('/about')}>About</MenuItem>
                <MenuItem onClick={() => handleNavigate('/contact')}>Contact</MenuItem>
                <MenuItem 
                  onClick={() => handleNavigate('/voice-assistant')}
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 'bold' 
                  }}
                >
                  Voice Assistant
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 8 }}>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/"
                  sx={{ 
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/vehicles"
                  sx={{ 
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Vehicles
                </Button>
                <Button 
                  color="inherit"
                  component={RouterLink} 
                  to="/services"
                  sx={{ 
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Services
                </Button>
                <Button 
                  color="inherit"
                  component={RouterLink} 
                  to="/about"
                  sx={{ 
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  About
                </Button>
                <Button 
                  color="inherit"
                  component={RouterLink} 
                  to="/contact"
                  sx={{ 
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Contact
                </Button>
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                className="cyber-button"
                component={RouterLink}
                to="/signin"
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '4px',
                }}
              >
                SIGN IN
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;