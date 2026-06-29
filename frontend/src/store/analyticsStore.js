import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/analytics';

export const useAnalyticsStore = create((set) => ({
  weeklyData: [],
  loading: false,

  fetchWeeklyAnalytics: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/weekly`, { headers: getAuthHeaders() });
      set({ weeklyData: res.data.chartData, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  }
}));
