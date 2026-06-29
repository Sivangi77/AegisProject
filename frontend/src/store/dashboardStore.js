import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/dashboard';

export const useDashboardStore = create((set) => ({
  dashboardData: null,
  loading: true,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      set({ dashboardData: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
