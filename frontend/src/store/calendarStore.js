import { create } from 'zustand';
import axios from 'axios';
import { auth } from '../services/firebase/config';

const getAuthHeaders = () => {
  const user = auth.currentUser;
  if (!user) return {};
  return { Authorization: `Bearer ${user.uid}` };
};

const API_URL = 'http://localhost:5000/api/calendar/events';

export const useCalendarStore = create((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      set({ events: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addEvent: async (eventData) => {
    try {
      const res = await axios.post(API_URL, eventData, { headers: getAuthHeaders() });
      set((state) => ({ events: [...state.events, res.data] }));
      return res.data;
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates, { headers: getAuthHeaders() });
      set((state) => ({
        events: state.events.map(e => e._id === id ? res.data : e)
      }));
      return res.data;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      set((state) => ({
        events: state.events.filter(e => e._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }
}));
