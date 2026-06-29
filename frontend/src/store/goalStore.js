import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/goals';

export const useGoalStore = create((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      set({ goals: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createGoal: async (goalData) => {
    try {
      const res = await axios.post(API_URL, goalData, { headers: getAuthHeaders() });
      set((state) => ({ goals: [res.data, ...state.goals] }));
      return res.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProgress: async (id, progress) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/progress`, { progress }, { headers: getAuthHeaders() });
      set((state) => ({
        goals: state.goals.map(g => g._id === id ? res.data : g)
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteGoal: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      set((state) => ({
        goals: state.goals.filter(g => g._id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));
