import { GoogleGenerativeAI } from '@google/generative-ai';
import Config from 'react-native-config';

// Initialize the Gemini API with the API key from environment variables
const API_KEY = Config.GEMINI_API_KEY || 'AIzaSyC14PHPrh9xsETcIdJTAty2YQ6ntaT3qog'; // Fallback for development
const genAI = new GoogleGenerativeAI(API_KEY);

// Available models - we'll use this to handle model availability errors
const AVAILABLE_MODELS = ['gemini-pro', 'gemini-1.5-pro'];

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    return 'I apologize, but I am unable to provide a response at the moment. Please try again later.';
  }
};

// Offline responses when API is not available
const getOfflineResponse = (prompt: string): string => {
  // Basic pattern matching to provide default responses when API is unavailable
  if (prompt.includes('HIGH_PULSE')) {
    return `For your elevated pulse rate:
1. Take slow, deep breaths for 5 minutes
2. Find a safe, quiet place to sit down
3. Drink water if available
4. Call a trusted friend or emergency contact if you feel unsafe
5. Consider basic relaxation techniques like counting to 10`;
  } else if (prompt.includes('SAFETY_TIPS')) {
    return `Safety Tips:
1. Share your location with trusted contacts
2. Stay aware of your surroundings
3. Trust your instincts and leave uncomfortable situations
4. Keep emergency contacts easily accessible
5. Consider using safety apps with SOS features`;
  }
  
  return 'I apologize, but I cannot provide assistance at the moment. Please try again later when a connection is available.';
};

// Predefined prompts for different scenarios
export const GEMINI_PROMPTS = {
  INTRODUCTION: `You are a caring and supportive AI assistant in a women's safety app. Introduce yourself warmly and explain how you can help with safety advice, emotional support, and monitoring well-being through pulse readings. Keep your response concise but friendly.`,
  
  HIGH_PULSE: (pulseRate: number) => `A user's pulse rate of ${pulseRate} BPM has been detected, which is concerning. Provide a brief, calming response that:
1. Acknowledges the high pulse rate
2. Offers immediate calming suggestions
3. Explains what might cause elevated pulse
4. Recommends next steps
Keep the response under 200 characters and prioritize immediate actionable advice.`,
  
  SAFETY_CONCERN: `You are responding to a user who may be in danger. Provide clear, concise safety advice. Focus on:
1. Immediate actions to take
2. How to seek help
3. Ways to stay calm
Keep responses brief and actionable.`,

  EMOTIONAL_SUPPORT: `You are providing emotional support to a user. Be empathetic and understanding. Focus on:
1. Validating their feelings
2. Offering coping strategies
3. Suggesting professional help if needed
Keep responses warm but professional.`,

  PULSE_INFO: `Explain the significance of pulse monitoring for safety and well-being. Include:
1. Normal pulse ranges
2. What high pulse might indicate
3. How to use pulse readings effectively
Keep it simple and informative.`,

  WHAT_IS_WMI: `
    Explain in simple terms what Wearable Monitoring Intelligence (WMI) is, 
    how it relates to biometric data like pulse rate, and how it can be used 
    for women's safety applications. Keep your response brief and informative.
  `,
  SKIN_CONDUCTANCE: `
    Explain how skin conductance (also known as galvanic skin response) can be used to detect 
    fear or stress, and how this might be useful in a women's safety application. 
    Keep your explanation simple and concise.
  `,
  CHRONIC_FATIGUE: `
    What is Chronic Fatigue Syndrome, and how might it impact someone's safety? 
    How can monitoring biometric data help manage chronic fatigue? 
    Please provide a brief, informative response for women's health and safety.
  `,
  SAFETY_TIPS: `
    Provide 3-5 practical safety tips that women can follow in potentially 
    unsafe situations. These should be actionable, clear, and focused on 
    personal safety. Keep your response concise.
  `,
  PULSE_EMOTIONS: `
    Explain the relationship between pulse rate and emotional states.
    How can elevated heart rate indicate fear, anxiety, or stress?
    How can this information be used for women's personal safety?
    Keep your response brief and informative.
  `,
};

export const formatSafetyResponse = (response: string): string => {
  // Ensure response isn't too long for toast/alert
  if (response.length > 200) {
    return response.substring(0, 197) + '...';
  }
  return response;
};

export default {
  generateGeminiResponse,
  GEMINI_PROMPTS,
  formatSafetyResponse,
};
