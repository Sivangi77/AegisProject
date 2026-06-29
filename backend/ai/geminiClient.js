const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getGeminiResponse = async (prompt, systemInstruction = '') => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.status === 401 || (error.message && error.message.includes('API_KEY_INVALID'))) {
        throw new Error('Invalid Gemini API Key. Please check your configuration.');
    }
    if (error.status === 429) {
        throw new Error('Gemini Rate limit exceeded. Please try again later.');
    }
    if (!error.response && (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED')) {
        throw new Error('Network failure: Unable to connect to Gemini API.');
    }
    if (error.message) {
        throw new Error(`AI Service Error: ${error.message}`);
    }
    throw new Error('Failed to generate AI response');
  }
};

const streamGeminiResponse = async (history, newPrompt, systemInstruction = '') => {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: formattedHistory
    });

    const resultStream = await chat.sendMessageStream({ message: newPrompt });
    return resultStream;
  } catch (error) {
    console.error('Gemini Stream API Error:', error);
    if (error.status === 401 || (error.message && error.message.includes('API_KEY_INVALID'))) {
        throw new Error('Invalid Gemini API Key. Please check your configuration.');
    }
    if (error.status === 429) {
        throw new Error('Gemini Rate limit exceeded. Please try again later.');
    }
    if (!error.response && (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED')) {
        throw new Error('Network failure: Unable to connect to Gemini API.');
    }
    if (error.message) {
        throw new Error(`AI Stream Error: ${error.message}`);
    }
    throw new Error('Failed to generate AI stream');
  }
};

module.exports = { getGeminiResponse, streamGeminiResponse };
