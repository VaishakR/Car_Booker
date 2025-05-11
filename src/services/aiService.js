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
    // Check for "forget" commands
    const forgetRegex = /forget\s+(all|everything|keywords|preferences)/i;
    if (forgetRegex.test(userInput)) {
      // Return a special command to clear keywords
      return ["__CLEAR_KEYWORDS__"];
    }
    
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
3. Be specific and precise with keyword extraction
4. IMPORTANT: The most recent mentioned attributes are the most important ones

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
      topCars.map(car => `${car.name} (${car.type}, AED ${car.price.toLocaleString()}, features: ${car.features.slice(0, 3).join(", ")})`).join("\n") : 
      "No specific cars match yet.";
    
    // Get latest keyword for emphasis
    const latestKeyword = keywords.length > 0 ? keywords[keywords.length - 1] : "";
    
    // Create the prompt for the LLaMA model
    const prompt = `
You are a knowledgeable car dealership AI assistant. You have DIRECT ACCESS to the dealership's inventory system.
The customer is looking for a car and you are helping them find the perfect vehicle based on their preferences.

INVENTORY ACCESS RESULT:
Current customer preferences: ${keywords.join(", ")}
Latest search priority: ${latestKeyword}
Top matching vehicles in inventory:
${carSummary}

RESPONSE GUIDELINES:
1. Speak as if you have DIRECT ACCESS to the dealership's inventory. Say things like "I see we have" or "Looking at our inventory"
2. Prioritize recommendations that match the LATEST preference if provided
3. Sound confident and knowledgeable about the cars
4. Mention specific cars by name that match their criteria
5. If they haven't specified enough details, ask targeted questions about their needs (family, budget, etc.)
6. If a customer asks about multiple criteria (e.g., "family" then "electric"), prioritize showing cars that match BOTH criteria
7. Respond in a natural, conversational way as a helpful dealership assistant

${conciseMode ? 'Keep your responses very concise (1-2 sentences maximum).' : ''}

Customer input: "${userInput}"
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