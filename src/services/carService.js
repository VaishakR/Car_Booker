import carsData from '../assets/data/cars.json';

// Get all cars
export const getAllCars = () => {
  return carsData;
};

// Get cars that are in store
export const getAvailableCars = () => {
  return carsData.filter(car => car.inStore);
};

// Find cars that match given keywords
export const findMatchingCars = (keywords) => {
  // First, ensure keywords is an array of strings
  if (!Array.isArray(keywords)) {
    console.error("Keywords must be an array:", keywords);
    return [];
  }
  
  // Import your car data
  const cars = require('../assets/data/cars.json');
  
  // Create a copy of the keywords array to work with
  const keywordsLower = keywords
    .filter(keyword => typeof keyword === 'string')
    .map(keyword => keyword.toLowerCase());
    
  // Get the most recent keyword for prioritization
  const latestKeyword = keywordsLower.length > 0 ? keywordsLower[keywordsLower.length - 1] : null;
  
  // Separate keywords by category for progressive filtering
  const typeKeywords = keywordsLower.filter(kw => 
    ['sedan', 'suv', 'convertible', 'coupe', 'truck', 'van', 'hatchback', 'wagon'].includes(kw)
  );
  
  const featureKeywords = keywordsLower.filter(kw => 
    ['electric', 'hybrid', 'fast', 'luxury', 'premium', 'budget', 'affordable', 
     'family', 'business', 'spacious', 'comfortable', 'safe', 'reliable'].includes(kw)
  );
  
  const priceKeywords = keywordsLower.filter(kw => 
    ['cheap', 'affordable', 'budget', 'expensive', 'luxury', 'premium', 'mid-range'].includes(kw)
  );
  
  // Start with all cars and progressively filter
  let filteredCars = [...cars];
  
  // Filter by car type if specified
  if (typeKeywords.length > 0) {
    filteredCars = filteredCars.filter(car => {
      return typeKeywords.some(keyword => car.type && car.type.toLowerCase().includes(keyword));
    });
  }
    // Filter by features
  if (featureKeywords.length > 0) {
    filteredCars = filteredCars.filter(car => {
      return featureKeywords.every(keyword => {
        // For feature keywords, check features array and description
        return (car.features && 
                car.features.some(feature => feature.toLowerCase().includes(keyword))) ||
               (car.description && car.description.toLowerCase().includes(keyword));
      });
    });
  }
  
  // Filter by price range
  if (priceKeywords.length > 0) {
    filteredCars = filteredCars.filter(car => {
      return priceKeywords.some(keyword => {
        if ((keyword === 'cheap' || keyword === 'affordable' || keyword === 'budget') && car.price < 30000) {
          return true;
        }
        if ((keyword === 'expensive' || keyword === 'luxury' || keyword === 'premium') && car.price > 60000) {
          return true;
        }
        if (keyword === 'mid-range' && car.price >= 30000 && car.price <= 60000) {
          return true;
        }
        return false;
      });
    });
  }
  
  // Prioritize cars that match most recent keyword
  if (latestKeyword && filteredCars.length > 0) {
    // Add relevance scores based on keyword matches, with highest priority to latest keyword
    filteredCars = filteredCars.map(car => {
      let relevanceScore = 0;
      
      // Increase score significantly if matches latest keyword
      if (car.type && car.type.toLowerCase().includes(latestKeyword)) {
        relevanceScore += 100;
      }
      
      if (car.features && car.features.some(feature => feature.toLowerCase().includes(latestKeyword))) {
        relevanceScore += 100;
      }
      
      if (car.description && car.description.toLowerCase().includes(latestKeyword)) {
        relevanceScore += 50;
      }
      
      // Add score for other keyword matches
      keywordsLower.forEach(keyword => {
        if (keyword !== latestKeyword) {
          if (car.type && car.type.toLowerCase().includes(keyword)) {
            relevanceScore += 20;
          }
          
          if (car.features && car.features.some(feature => feature.toLowerCase().includes(keyword))) {
            relevanceScore += 15;
          }
          
          if (car.description && car.description.toLowerCase().includes(keyword)) {
            relevanceScore += 5;
          }
        }
      });
      
      return { ...car, relevanceScore };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  // If no cars match all filters, try to match just the latest keyword
  if (filteredCars.length === 0 && keywords.length > 0) {
    const latestKeyword = keywords[keywords.length - 1].toLowerCase();
    
    return cars.filter(car => {
      // Match against type
      if (car.type && car.type.toLowerCase().includes(latestKeyword)) {
        return true;
      }
      
      // Match against features
      if (car.features && car.features.some(f => f.toLowerCase().includes(latestKeyword))) {
        return true;
      }
      
      // Match against description
      if (car.description && car.description.toLowerCase().includes(latestKeyword)) {
        return true;
      }
      
      return false;
    });
  }
  
  return filteredCars;
};

// Get similar cars that are in store
export const getSimilarAvailableCars = (car, limit = 3) => {
  if (!car) return [];
  
  // Compare by type and features
  const similarCars = carsData
    .filter(c => c.id !== car.id && c.inStore)
    .map(c => {
      // Calculate similarity score
      let score = 0;
      
      // Same type
      if (c.type === car.type) score += 3;
      
      // Similar price range (within 20%)
      const priceDiff = Math.abs(c.price - car.price) / car.price;
      if (priceDiff < 0.2) score += 2;
      
      // Matching features
      car.features.forEach(feature => {
        if (c.features.includes(feature)) score += 1;
      });
      
      return { ...c, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);
  
  return similarCars.slice(0, limit);
};

// Generate comparison between a car and its alternative
export const compareCarWithAlternative = (requestedCar, availableCar) => {
  if (!requestedCar || !availableCar) {
    return "I'm sorry, I couldn't find a good alternative to suggest.";
  }
  
  const response = `
I see you're interested in the ${requestedCar.name}. Unfortunately, that model isn't currently in our inventory. 

However, I'd like to suggest the ${availableCar.name} which is similar and available right now.

Let me compare them for you:

Both vehicles are ${requestedCar.type === availableCar.type ? `in the same ${requestedCar.type} category` : `similar, though the ${requestedCar.name} is a ${requestedCar.type} while the ${availableCar.name} is a ${availableCar.type}`}. 

The ${availableCar.name} offers these advantages:
${availableCar.pros.slice(0, 3).map(pro => `• ${pro}`).join('\n')}

It also addresses some limitations of the ${requestedCar.name}:
${requestedCar.cons.slice(0, 2).map(con => `• ${con}`).join('\n')}

Price-wise, the ${availableCar.name} is ${availableCar.price < requestedCar.price ? 'more affordable' : 'similarly priced'} at $${availableCar.price.toLocaleString()}.

Would you like to learn more about the ${availableCar.name} or see some of our other options?
`;

  return response;
};

// Get car by ID
export const getCarById = (id) => {
  return carsData.find(car => car.id === parseInt(id, 10));
};

// Filter cars by multiple criteria
export const filterCars = (filters = {}) => {
  let filteredCars = carsData;
  
  if (filters.inStore) {
    filteredCars = filteredCars.filter(car => car.inStore);
  }
  
  if (filters.type) {
    filteredCars = filteredCars.filter(car => car.type === filters.type);
  }
  
  if (filters.minPrice) {
    filteredCars = filteredCars.filter(car => car.price >= filters.minPrice);
  }
  
  if (filters.maxPrice) {
    filteredCars = filteredCars.filter(car => car.price <= filters.maxPrice);
  }
  
  if (filters.keywords && filters.keywords.length > 0) {
    filteredCars = filteredCars.filter(car => {
      return filters.keywords.some(keyword => 
        car.features.includes(keyword) || 
        car.type.includes(keyword) ||
        car.description.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }
  
  return filteredCars;
};