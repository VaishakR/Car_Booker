import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import CarCard from './CarCard';
import { motion } from 'framer-motion';

const CarList = ({ cars, isLoading }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (!cars || cars.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No vehicles found matching your criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <motion.div variants={itemVariants}>
              <CarCard car={car} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default CarList;