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
  
  // Filter cars based on the keywords
  return cars.filter(car => {
    // Check if any keyword is included in car properties
    return keywords.some(keyword => {
      // Ensure keyword is a string
      if (typeof keyword !== 'string') {
        console.warn(`Invalid keyword type: ${typeof keyword}`, keyword);
        return false;
      }
      
      const keywordLower = keyword.toLowerCase();
      
      // Check if the keyword matches car type
      if (car.type && car.type.toLowerCase().includes(keywordLower)) {
        return true;
      }
      
      // Check if any of the car features include the keyword
      if (car.features && Array.isArray(car.features) && 
          car.features.some(feature => 
            typeof feature === 'string' && feature.toLowerCase().includes(keywordLower)
          )) {
        return true;
      }
      
      // Check if price range keywords match
      if ((keywordLower === 'cheap' || keywordLower === 'affordable' || keywordLower === 'budget') && 
          car.price < 30000) {
        return true;
      }
      
      if ((keywordLower === 'expensive' || keywordLower === 'luxury' || keywordLower === 'premium') && 
          car.price > 60000) {
        return true;
      }
      
      if (keywordLower === 'mid-range' && car.price >= 30000 && car.price <= 60000) {
        return true;
      }
      
      // Check name and description
      if ((car.name && car.name.toLowerCase().includes(keywordLower)) || 
          (car.description && car.description.toLowerCase().includes(keywordLower))) {
        return true;
      }
      
      return false;
    });
  }).sort((a, b) => {
    // Calculate relevance score for car A
    const scoreA = keywords.filter(keyword => {
      if (typeof keyword !== 'string') return false;
      const kw = keyword.toLowerCase();
      return a.features.some(f => f.toLowerCase().includes(kw)) || 
             a.type.toLowerCase().includes(kw);
    }).length;
    
    // Calculate relevance score for car B
    const scoreB = keywords.filter(keyword => {
      if (typeof keyword !== 'string') return false;
      const kw = keyword.toLowerCase();
      return b.features.some(f => f.toLowerCase().includes(kw)) || 
             b.type.toLowerCase().includes(kw);
    }).length;
    
    return scoreB - scoreA; // Sort by highest relevance
  });
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