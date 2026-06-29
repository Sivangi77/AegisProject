import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase/config';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signup: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      set({ user: userCredential.user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Logout error', error);
    }
  }
}));
