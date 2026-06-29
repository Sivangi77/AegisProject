import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';
import toast from 'react-hot-toast';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/focus';

export const useFocusStore = create((set) => ({
  sessions: [],
  loading: false,

  fetchSessions: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      set({ sessions: res.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  saveSession: async (durationMinutes, taskContext = 'General Focus') => {
    try {
      const res = await axios.post(`${API_URL}/session`, { durationMinutes, taskContext }, { headers: getAuthHeaders() });
      set((state) => ({ sessions: [res.data.session, ...state.sessions] }));
      
      toast.success(`Session completed! +${res.data.pointsEarned} Productivity Points`);
      return res.data.session;
    } catch (error) {
      toast.error('Failed to save session');
      throw error;
    }
  }
}));
