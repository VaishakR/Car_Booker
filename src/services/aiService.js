import axios from 'axios';

const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

export const processWithLlama = async (prompt) => {
  try {
    const response = await axios.post(OLLAMA_ENDPOINT, {
      model: "llama3", // Make sure this matches your Ollama model name
      prompt: prompt,
      stream: false
    });
    
    return response.data.response;
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    throw new Error("Failed to process request with language model");
  }
};

export const extractKeywordsWithLlama = async (userInput) => {
  try {
    // Create a more focused prompt for keyword extraction
    const prompt = `
You are extracting keywords from a car rental customer query to match with our database.
Extract ONLY keywords that will help match with our database categories.

Categories in our database:
- Car types: sedan, suv, convertible, coupe, truck, van, hatchback, wagon
- Features: electric, hybrid, fast, luxury, premium, budget, affordable
- Use cases: family, business, road trip, city, off-road
- Needs: spacious, comfortable, safe, reliable

User query: "${userInput}"

Respond ONLY with a JSON array of 2-4 most relevant keywords. Example: ["luxury", "sedan"]
`;

    const response = await processWithLlama(prompt);
    
    // Try to parse the JSON array from the response
    try {
      const match = response.match(/\[.*\]/s);
      if (match) {
        const extractedArray = JSON.parse(match[0]);
        return extractedArray;
      }
      return [];
    } catch (parseError) {
      console.error("Error parsing keywords from LLaMA:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error extracting keywords with LLaMA:", error);
    throw error;
  }
};

export const generateCarRecommendation = async (userInput, matchedCars, currentKeywords) => {
  try {
    // Prepare the matched cars data for the prompt
    const carsData = matchedCars.slice(0, 3).map(car => ({
      name: car.name,
      type: car.type,
      price: car.price,
      features: car.features.slice(0, 3).join(", ")
    }));
    
    const prompt = `
You are a car advisor AI that gives EXTREMELY CONCISE responses (1-3 lines maximum).

User query: "${userInput}"

Identified preferences: ${currentKeywords.join(", ")}

Top matching cars:
${JSON.stringify(carsData, null, 1)}

Give a brief, helpful response mentioning the best match if clear. Ask ONE specific question to refine results.
DO NOT list all cars. 1-3 lines total response.
`;

    const response = await processWithLlama(prompt);
    return response.trim();
  } catch (error) {
    console.error("Error generating recommendation with LLaMA:", error);
    throw error;
  }
};

export const compareVehicles = async (requestedCar, alternativeCar) => {
  if (!requestedCar || !alternativeCar) {
    return "I'm sorry, I couldn't find a good alternative to suggest.";
  }
  
  const prompt = `
Give an EXTREMELY BRIEF comparison (2-3 lines maximum):
Requested (unavailable): ${requestedCar.name} (${requestedCar.type}) at $${requestedCar.price}
Alternative (available): ${alternativeCar.name} (${alternativeCar.type}) at $${alternativeCar.price}

Reply in 2-3 lines only, suggesting the alternative and one key advantage.
`;

  try {
    return await processWithLlama(prompt);
  } catch (error) {
    console.error("Error generating comparison with LLaMA:", error);
    throw error;
  }
};

export default {
  extractKeywordsWithLlama,
  generateCarRecommendation,
  compareVehicles
};