import { create } from 'zustand';
import apiClient from '../services/api/client';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/tasks');
      set({ tasks: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/tasks', taskData);
      set((state) => ({ 
        tasks: [...state.tasks, response.data.data],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}`, { status });
      set((state) => ({
        tasks: state.tasks.map(t => t._id === taskId ? response.data.data : t)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
