import { generateGeminiResponse } from './geminiService';

// Define chat context
interface ChatContext {
  userName?: string;
  lastPulse?: string;
  emergencyContact?: string;
}

// Chat history interface
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Format context for the AI
const formatContextForAI = (context: ChatContext): string => {
  const parts = [];
  if (context.userName) {
    parts.push(`The user's name is ${context.userName}.`);
  }
  if (context.lastPulse) {
    parts.push(`The user's last recorded pulse was ${context.lastPulse} BPM.`);
  }
  if (context.emergencyContact) {
    parts.push(`The user's emergency contact is ${context.emergencyContact}.`);
  }

  return parts.length ? parts.join(' ') : '';
};

// Generate system prompt
const generateSystemPrompt = (context: ChatContext): string => {
  return `You are a helpful and supportive AI assistant in a women's safety app. 
Your primary goal is to provide safety advice, emotional support, and practical guidance.

${formatContextForAI(context)}

Keep your responses focused on women's safety, emotional well-being, and practical advice.
Never suggest anything dangerous. Be reassuring, direct, and provide actionable steps.
Limit responses to 2-3 short paragraphs maximum.

If the user appears to be in immediate danger, suggest:
1. Getting to a safe location
2. Contacting emergency services (local emergency number)
3. Alerting trusted contacts
4. Using the SOS button in the app

For mental health concerns, suggest calming techniques, seeking professional help, and using support networks.`;
};

// Main chat function
export const generateChatResponse = async (
  message: string,
  history: ChatMessage[],
  context: ChatContext = {}
): Promise<string> => {
  try {
    // Format the conversation history and context for the API
    const systemPrompt = generateSystemPrompt(context);
    
    // Combine system prompt, history and new message
    const fullPrompt = `${systemPrompt}

CONVERSATION HISTORY:
${history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

User: ${message}
Assistant: `;

    // Generate response from Gemini API
    const response = await generateGeminiResponse(fullPrompt);
    
    return response;
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'I apologize, but I cannot provide assistance at the moment. If you are in an emergency situation, please use the SOS button or contact emergency services directly.';
  }
};

// Safe responses for common dangerous situations
export const SAFETY_RESPONSES = {
  BEING_FOLLOWED: `If you think you're being followed:
1. Stay calm and trust your instincts
2. Change direction to confirm if you're being followed
3. Move to a public place with other people
4. Call someone to let them know your situation
5. Consider using the SOS button in this app`,

  FEELING_UNSAFE: `When you feel unsafe in any situation:
1. Trust your instincts - they're often right
2. Move to a well-lit, public area with other people
3. Keep your phone ready and fully charged
4. Stay alert and aware of your surroundings
5. Have your emergency contacts accessible`,
  
  EMERGENCY_CONTACTS: `Setting up emergency contacts is important:
1. Choose people who are reliable and responsive
2. Make sure they know what to do if you contact them in emergency
3. Share your frequent locations with them
4. Consider using location sharing apps
5. Update their contact info regularly`,
};

export default {
  generateChatResponse,
  SAFETY_RESPONSES,
}; 