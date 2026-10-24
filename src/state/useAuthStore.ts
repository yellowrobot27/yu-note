import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import {
  login as loginService,
  logout as logoutService,
} from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeSession: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const user = await loginService(email, password);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await logoutService();

    // The auth-state listener also updates this state.
    // These assignments ensure the action finishes consistently.
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  initializeSession: () => {
    let active = true;
    let sessionEventReceived = false;

    set({ isLoading: true });

    // Subscribe before checking the existing session so we
    // don't miss a login or logout while initialization runs.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      sessionEventReceived = true;

      if (!active) return;

      const authUser = session?.user;

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
    });

    // Restore the existing session.
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

    // Called when the root layout unmounts.
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  },
}));