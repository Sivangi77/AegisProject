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
import axios from 'axios';

// Helper to sync with backend
const syncUserWithBackend = async (firebaseUser) => {
  if (!firebaseUser) return null;
  try {
    const provider = firebaseUser.providerData[0]?.providerId || 'password';
    const res = await axios.post('http://localhost:5000/api/users/sync', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      provider
    });
    return res.data; // MongoDB user document
  } catch (error) {
    console.error('Failed to sync user with backend:', error);
    return null; // Return null on failure so we don't break the app
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  init: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const mongoUser = await syncUserWithBackend(user);
        set({ user: mongoUser ? { ...user, ...mongoUser } : user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const mongoUser = await syncUserWithBackend(userCredential.user);
      set({ 
        user: mongoUser ? { ...userCredential.user, ...mongoUser } : userCredential.user, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signup: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const mongoUser = await syncUserWithBackend(userCredential.user);
      set({ 
        user: mongoUser ? { ...userCredential.user, ...mongoUser } : userCredential.user, 
        loading: false 
      });
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
      const mongoUser = await syncUserWithBackend(userCredential.user);
      set({ 
        user: mongoUser ? { ...userCredential.user, ...mongoUser } : userCredential.user, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
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
