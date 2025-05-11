import React from 'react';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;