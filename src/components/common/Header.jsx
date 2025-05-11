import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Container>
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              color: 'text.primary',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            RENTAL
          </Typography>
          
          <Box>
            <Button color="inherit" component={RouterLink} to="/">Home</Button>
            <Button color="inherit" component={RouterLink} to="/vehicles">Vehicles</Button>
            <Button 
              variant="contained" 
              color="primary"
              component={RouterLink}
              to="/?voice=true"
            >
              Voice Assistant
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;