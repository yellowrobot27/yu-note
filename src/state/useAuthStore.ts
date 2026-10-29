import { create } from 'zustand';
import { Platform } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
  handleNativeAuthRedirect as handleNativeAuthRedirectService,
  requestPasswordReset as requestPasswordResetService,
  updatePassword as updatePasswordService,
} from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeSession: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isPasswordRecovery: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const user = await loginService(email, password);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isPasswordRecovery: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true });

    try {
      const user = await registerService(email, password);
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        isPasswordRecovery: false,
      });
      return !!user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true });

    try {
      await requestPasswordResetService(email);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updatePassword: async (password) => {
    set({ isLoading: true });

    try {
      await updatePasswordService(password);
      set({ isLoading: false, isPasswordRecovery: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await logoutService();
    set({
      user: null,
      isAuthenticated: false,
      isPasswordRecovery: false,
    });
  },

  initializeSession: () => {
    let active = true;
    let sessionEventReceived = false;
    let lastHandledAuthUrl: string | null = null;

    set({ isLoading: true });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      sessionEventReceived = true;
      if (!active) return;

      const authUser = session?.user;

      set((state) => ({
        user: authUser
          ? {
              id: authUser.id,
              email: authUser.email ?? '',
            }
          : null,
        isAuthenticated: !!authUser,
        isLoading: false,
        isPasswordRecovery:
          event === 'PASSWORD_RECOVERY' ? true : state.isPasswordRecovery,
      }));
    });

    const handleAuthUrl = async (url: string) => {
      if (!active || url === lastHandledAuthUrl) return;
      lastHandledAuthUrl = url;

      try {
        const isPasswordRecovery = await handleNativeAuthRedirectService(url);
        if (active && isPasswordRecovery) set({ isPasswordRecovery: true });
      } catch {
        // Invalid or expired links are handled by the auth screen's normal flow.
      }
    };

    const linkingSubscription =
      Platform.OS === 'web'
        ? null
        : ExpoLinking.addEventListener('url', ({ url }) => {
            void handleAuthUrl(url);
          });

    if (Platform.OS !== 'web') {
      void ExpoLinking.getInitialURL().then((url) => {
        if (url) void handleAuthUrl(url);
      });
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || sessionEventReceived) return;

        if (error) {
          set({ isLoading: false });
          return;
        }

        const authUser = data.session?.user;

        set({
          user: authUser
            ? {
                id: authUser.id,
                email: authUser.email ?? '',
              }
            : null,
          isAuthenticated: !!authUser,
          isLoading: false,
        });
      })
      .catch(() => {
        if (active && !sessionEventReceived) {
          set({ isLoading: false });
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
      linkingSubscription?.remove();
    };
  },
}));
