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
- Price range: cheap/affordable (under $30k), mid-range ($30k-$60k), expensive/luxury (over $60k)

Process these user preferences:
1. If a preference contradicts an earlier one (e.g., "cheap" then "expensive"), use the latest preference
2. Return ONLY simple string keywords, no objects or structured data

User query: "${userInput}"

Respond ONLY with a simple comma-separated list of 2-4 most relevant keywords. Example: "luxury,sedan,comfortable"
`;

    const response = await processWithLlama(prompt);
    
    // Parse the response to get simple keywords
    const cleanedResponse = response.trim().replace(/[\[\]"]/g, '');
    const keywords = cleanedResponse
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);
    
    return keywords;
  } catch (error) {
    console.error("Error extracting keywords with LLaMA:", error);
    return [];
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

Current preferences: ${currentKeywords.join(", ")}

Top matching cars:
${JSON.stringify(carsData, null, 1)}

Give a brief, helpful response mentioning the best match if clear. Ask ONE specific question to refine results.
DO NOT list all cars. 1-3 lines total response.
NEVER return JSON objects, structured data, or labeled categories in your response.
ALWAYS return plain text only.
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

// Add this new function to your existing aiService.js
export const generateConversationResponse = async (userInput, keywords, conversationHistory, conciseMode = false) => {
  try {
    // Get top cars based on current keywords to inform the AI
    const carService = require('./carService');
    const topCars = carService.findMatchingCars(keywords).slice(0, 3);
    
    // Create a summary of top matching cars for the AI to reference
    const carSummary = topCars.length > 0 ? 
      topCars.map(car => `${car.name} (${car.type}, $${car.price.toLocaleString()}, features: ${car.features.slice(0, 3).join(", ")})`).join("\n") : 
      "No specific cars match yet.";
    
    // Create the prompt for the LLaMA model
    const prompt = `
You are a helpful car shopping assistant having a conversation with a customer about what car they might want to buy.
You NEVER reveal what specific keywords you've extracted from the customer's message.

Current customer preferences identified: ${keywords.join(", ")}

Top matching cars:
${carSummary}

Your task is to:
1. Have a natural, helpful conversation to understand the customer's car needs
2. If they haven't mentioned budget, ask about it
3. If they haven't mentioned car type (sedan, SUV, etc.), ask about it
4. If they haven't mentioned use case (commuting, family, etc.), ask about it
5. If they ask for recommendations, mention AT MOST ONE specific car that matches their needs

${conciseMode ? 'Keep your responses very concise (1-2 sentences maximum).' : ''}
Always respond in a conversational, helpful tone. Don't list features or specifications unless specifically asked.

User input: "${userInput}"
Your response:`;
    
    const response = await processWithLlama(prompt);
    return response.trim();
  } catch (error) {
    console.error("Error generating conversation response with LLaMA:", error);
    return "I'm sorry, I'm having trouble understanding. Could you tell me more about what kind of car you're looking for?";
  }
};

export default {
  extractKeywordsWithLlama,
  generateCarRecommendation,
  compareVehicles
};