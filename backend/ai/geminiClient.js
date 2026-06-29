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
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
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
    throw new Error('Failed to generate AI stream');
  }
};

module.exports = { getGeminiResponse, streamGeminiResponse };
