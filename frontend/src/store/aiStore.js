import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/ai';

export const useAIStore = create((set, get) => ({
  messages: [],
  loadingHistory: true,
  isTyping: false,
  error: null,

  fetchHistory: async () => {
    set({ loadingHistory: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/history`, { headers: getAuthHeaders() });
      set({ messages: res.data, loadingHistory: false });
    } catch (error) {
      set({ error: error.message, loadingHistory: false });
    }
  },

  sendMessage: async (text) => {
    // Optimistically add user message and an empty placeholder for the AI response
    const tempUserId = Date.now().toString();
    const tempModelId = (Date.now() + 1).toString();
    
    set((state) => ({
      messages: [
        ...state.messages, 
        { _id: tempUserId, role: 'user', text },
        { _id: tempModelId, role: 'model', text: '' }
      ],
      isTyping: true,
      error: null
    }));

    try {
      const user = auth.currentUser;
      const headers = {
        'Content-Type': 'application/json',
        ...(user ? { Authorization: `Bearer ${user.uid}` } : {})
      };

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                   set({ error: data.error });
                   break;
                }
                
                // Append text to the placeholder model message
                set((state) => {
                  const newMessages = [...state.messages];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg && lastMsg.role === 'model') {
                    lastMsg.text += data.text;
                  }
                  return { messages: newMessages };
                });
              } catch (e) {
                console.error("Error parsing SSE JSON:", e);
              }
            }
          }
        }
      }
      set({ isTyping: false });
    } catch (error) {
      console.error('Failed to send message:', error);
      set({ error: error.message, isTyping: false });
    }
  }
}));
