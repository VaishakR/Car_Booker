import React from 'react';
import { Box, Container } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: 'calc(100vh - 64px - 300px)', // Viewport height minus header and footer
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;