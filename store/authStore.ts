import { error } from './../node_modules/expo-dev-launcher/node_modules/ajv/lib/vocabularies/applicator/dependencies';
import { create } from 'zustand';
import { supabase } from '@/utils/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';

const clientId = '1071179724818-qdl9bk2uvb5pr4bg4irrqti6vm1g2eff.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const authConfig : AuthSession.AuthRequestConfig = {
  clientId: clientId,
  scopes: ["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email", 'openid'],
  redirectUri: AuthSession.makeRedirectUri({scheme: 'com.feelingburnout.app'}),
};

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
          full_name: username, // Updated to use 'username' field
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
    set((prev: any) => ({ ...prev, userLoading: true, errorMsg: null }));

  const request = new AuthSession.AuthRequest(authConfig);
  const response = await request.promptAsync(discovery, {showInRecents: true}); 

  if (response.type !== 'success') {
    set((prev: any) => ({ ...prev, userLoading: false, errorMsg: 'Google sign-in failed' }));
    return;
  }

  if (response?.type === 'success') {
  const { code } = response.params;

  const tokenResult: AuthSession.TokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: authConfig.clientId,
      code,
      redirectUri: authConfig.redirectUri,
      extraParams: {
        code_verifier: request.codeVerifier || '',
      },
    },
    discovery
  );


  if (tokenResult.idToken) {
    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokenResult.idToken,
      access_token: tokenResult.accessToken,
    })

    if (error) {
      set((prev: any) => ({ ...prev, userLoading: false, errorMsg: error.message }));
      return;
    } else {
      set((prev: any) => ({ ...prev, user: data.user, userLoading: false }));
      return;
    }
  }}

  set((prev: any) => ({ ...prev, userLoading: false, errorMsg: 'Google sign-in failed' }));

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