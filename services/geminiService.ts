import { GoogleGenAI, Type } from "@google/genai";
import { FoodOption, Recommendation, Restaurant, MenuItem, User } from '../types';

// FIX: Initialized GoogleGenAI directly with process.env.API_KEY as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const foodOptionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      restaurantName: { type: Type.STRING, description: "The name of the restaurant." },
      cuisine: { type: Type.STRING, description: "The type of cuisine, e.g., 'Italian', 'Mexican'." },
      itemName: { type: Type.STRING, description: "The name of the food item or meal." },
      description: { type: Type.STRING, description: "A brief, enticing description of the meal." },
      price: { type: Type.NUMBER, description: "The price of the item in USD." },
      offer: { type: Type.STRING, description: "Any special offer, like '15% off' or 'Free delivery'. Optional." },
      eta: { type: Type.STRING, description: "Estimated time of arrival, e.g., '25-35 min'." },
      rating: { type: Type.NUMBER, description: "The restaurant's rating out of 5, e.g., 4.7." }
    },
    required: ["restaurantName", "cuisine", "itemName", "description", "price", "eta", "rating"],
  },
};

const recommendationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            itemName: { type: Type.STRING, description: "The name of the recommended food item." },
            restaurantName: { type: Type.STRING, description: "The name of the restaurant offering the item." },
            imageUrl: { type: Type.STRING, description: "A realistic, high-quality image URL for the food item from a service like Unsplash." },
        },
        required: ["itemName", "restaurantName", "imageUrl"],
    }
};

const restaurantSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "The name of the restaurant." },
        cuisine: { type: Type.STRING, description: "The primary type of cuisine served." },
        rating: { type: Type.NUMBER, description: "The restaurant's rating out of 5." },
        eta: { type: Type.STRING, description: "The estimated delivery time." },
        offer: { type: Type.STRING, description: "A special offer, if any. e.g. '20% off entire order'." },
        imageUrl: { type: Type.STRING, description: "A realistic, high-quality image URL for the restaurant or a signature dish." },
      },
      required: ["name", "cuisine", "rating", "eta", "imageUrl"],
    }
};

const menuItemSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the menu item." },
            description: { type: Type.STRING, description: "A short, appealing description of the item." },
            price: { type: Type.NUMBER, description: "The price of the item in USD." },
        },
        required: ["name", "description", "price"],
    }
};

export const findFoodOptions = async (
  prompt: string,
  orderHistory: string[],
  priceRange: { min?: number; max?: number }
): Promise<FoodOption[] | string> => {
  try {
    const historyPrompt = orderHistory.length > 0
      ? `The user has previously enjoyed ordering: ${orderHistory.join(', ')}. Please keep this in mind when making suggestions.`
      : '';

    let pricePrompt = '';
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      pricePrompt = `Critically, all suggestions must have a price between $${priceRange.min} and $${priceRange.max}.`;
    } else if (priceRange.min !== undefined) {
      pricePrompt = `Critically, all suggestions must have a price of at least $${priceRange.min}.`;
    } else if (priceRange.max !== undefined) {
      pricePrompt = `Critically, all suggestions must have a price no more than $${priceRange.max}.`;
    }

    const systemInstruction = `You are a helpful and friendly AI agent for Uber Eats. Your goal is to find 3 excellent, realistic, but ultimately fictional meal options based on the user's request. You must compare them on price, offers, and availability. ${historyPrompt} ${pricePrompt} Always respond with a valid JSON array matching the provided schema. Do not include any text, notes, or apologies outside of the JSON structure. Generate diverse and appealing options.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: foodOptionSchema,
      },
    });

    const jsonText = response.text.trim();
    const foodOptions: FoodOption[] = JSON.parse(jsonText);
    return foodOptions;

  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm sorry, I encountered an issue while searching for food options. The kitchen might be a bit busy. Could you please try rephrasing your request?";
  }
};


export const getPersonalizedRecommendations = async (orderHistory: string[]): Promise<Recommendation[]> => {
    try {
        const prompt = orderHistory.length > 0
            ? `Based on a user's order history of: ${orderHistory.join(', ')}, act as a recommendation engine. Generate 3 diverse and personalized food recommendations. Suggest similar items, complementary dishes, or popular items from the same restaurants. The user has shown a clear preference for these types of foods.`
            : 'As a recommendation engine for a new user, generate 3 of the most popular and diverse food items on Uber Eats to welcome them.';
            
        const systemInstruction = `You are a recommendation engine. For each, provide an engaging, fictional but realistic image URL. Respond with ONLY a valid JSON array matching the provided schema. Do not include any text outside the JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Gemini recommendation error:", error);
        return [];
    }
};

export const getDashboardRestaurants = async (user: User, category: 'discover' | 'offers'): Promise<Restaurant[]> => {
    let prompt;

    if (category === 'offers') {
        prompt = `Generate a list of 6 diverse, fictional restaurants that are currently running special offers or promotions. Ensure each has a compelling offer listed.`;
    } else { // discover
        const historyPrompt = user.orderHistory.length > 0
            ? `Based on a user's order history of: ${user.orderHistory.join(', ')}, generate a list of 6 diverse and personalized restaurant recommendations they might enjoy.`
            : `For a new user, generate a list of 6 diverse and highly-rated fictional restaurants to welcome them.`;
        prompt = historyPrompt;
    }
    
    const systemInstruction = `You are an AI assistant for a food delivery app. Respond with ONLY a valid JSON array matching the provided schema. Do not include any text outside the JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: restaurantSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini dashboard error:", error);
        return [];
    }
};

export const getMenuItemsForRestaurant = async (restaurantName: string): Promise<MenuItem[]> => {
    const prompt = `Generate a list of 5 popular and appealing fictional menu items for a restaurant named "${restaurantName}". Provide a mix of entrees, sides, or appetizers.`;
    const systemInstruction = `You are an AI assistant for a food delivery app. Respond with ONLY a valid JSON array matching the provided schema. Do not include any text outside the JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: menuItemSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini menu item error:", error);
        return [];
    }
};