import { create } from 'zustand';
import { supabase } from '@/utils/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

type AuthStore = {
  user: User | null;
  userLoading: boolean;
  errorMsg: string | null;
  session: Session | null;

  // actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  userLoading: true,
  errorMsg: null,
  session: null,

  setSession: (session) => set({ session }),

  setUser: (user) => set({ user }),

  getSession: async () => {
    set((prev) => ({ ...prev, userLoading: true }));
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      set((prev) => ({
        ...prev,
        errorMsg: error.message,
        userLoading: false,
        user: null,
      }));
      return;
    }

    set((prev) => ({ ...prev,  user: user ?? null, userLoading: false }));
  },

  signIn: async (email, password) => {
    set((prev) => ({ ...prev, userLoading: true, errorMsg: null }));
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set((prev) => ({
        ...prev,
        errorMsg: error.message,
        userLoading: false,
        user: null,
      }));
      return false;
    }

    set((prev) => ({ ...prev, user: data.user, userLoading: false }));
    return true;
  },

  signUp: async (email, password, username) => {
    set((prev) => ({ ...prev, userLoading: true, errorMsg: null }));

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName: username, // Updated to use 'username' field
        },
      },
    });

    if (signUpError) {
      set((prev) => ({
        ...prev,
        errorMsg: signUpError.message,
        userLoading: false,
        user: null,
      }));
      return false;
    }

    // After signup, the user is created but not logged in until email verification.
    // We set the user state to null to reflect the unauthenticated status.
    set((prev) => ({
      ...prev,
      user: data.user,
      userLoading: false,
    }));
    
    return true;
  },

  signInWithGoogle: async () => {
    set((prev) => ({ ...prev, userLoading: true, errorMsg: null }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'YOUR_APP_DEEPLINK_URL',
      },
    });

    if (error) {
      set((prev) => ({ ...prev, errorMsg: error.message, userLoading: false }));
    }
  },

  signOut: async () => {
    set((prev) => ({ ...prev, userLoading: true }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      set((prev) => ({ ...prev, errorMsg: error.message, userLoading: false }));
    } else {
      set((prev) => ({ ...prev, user: null, userLoading: false }));
    }
  },

  clearError: () => set((prev) => ({ ...prev, errorMsg: null })),
}));