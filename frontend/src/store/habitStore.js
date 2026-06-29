import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/habits';

export const useHabitStore = create((set, get) => ({
  habits: [],
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      set({ habits: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createHabit: async (title) => {
    try {
      const res = await axios.post(API_URL, { title }, { headers: getAuthHeaders() });
      set((state) => ({ habits: [res.data, ...state.habits] }));
      return res.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  toggleHabit: async (id) => {
    try {
      // Optimistic update
      const today = new Date().setHours(0, 0, 0, 0);
      set((state) => {
        const habits = [...state.habits];
        const idx = habits.findIndex(h => h._id === id);
        if (idx !== -1) {
           const habit = { ...habits[idx] };
           const completedTodayIdx = habit.history.findIndex(d => new Date(d).setHours(0,0,0,0) === today);
           if (completedTodayIdx !== -1) {
              habit.history.splice(completedTodayIdx, 1);
              habit.streak = Math.max(0, habit.streak - 1);
           } else {
              habit.history.push(new Date(today).toISOString());
              habit.streak += 1;
           }
           habits[idx] = habit;
        }
        return { habits };
      });
      
      const res = await axios.post(`${API_URL}/${id}/toggle`, {}, { headers: getAuthHeaders() });
      
      // Update with server source of truth
      set((state) => ({
        habits: state.habits.map(h => h._id === id ? res.data : h)
      }));
    } catch (error) {
      set({ error: error.message });
      // Revert optimism by refetching
      get().fetchHabits();
    }
  },

  deleteHabit: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      set((state) => ({
        habits: state.habits.filter(h => h._id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));
