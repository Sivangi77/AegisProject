import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/tasks';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      set({ tasks: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const res = await axios.post(API_URL, taskData, { headers: getAuthHeaders() });
      set((state) => ({ tasks: [res.data, ...state.tasks] }));
      return res.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates, { headers: getAuthHeaders() });
      set((state) => ({
        tasks: state.tasks.map(t => t._id === id ? res.data : t)
      }));
      return res.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      set((state) => ({
        tasks: state.tasks.filter(t => t._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }
}));
