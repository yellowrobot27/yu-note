import { Platform } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { id: data.user.id, email: data.user.email! };
}

export async function register(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Registration did not return a user.');

  // Supabase returns a user without a session when email confirmation is required.
  // Treat that state as pending confirmation rather than as an authenticated user.
  if (!data.session) return null;

  return { id: data.user.id, email: data.user.email! };
}

export async function requestPasswordReset(email: string): Promise<void> {
  const redirectTo =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}/forgot-password`
      : ExpoLinking.createURL('forgot-password');

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
}

export async function handleNativeAuthRedirect(url: string): Promise<boolean> {
  const parsedUrl = new URL(url);
  const authParams = new URLSearchParams(
    [parsedUrl.search.slice(1), parsedUrl.hash.slice(1)].filter(Boolean).join('&'),
  );
  const accessToken = authParams.get('access_token');
  const refreshToken = authParams.get('refresh_token');
  const authType = authParams.get('type');

  if (!accessToken || !refreshToken) return false;

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw new Error(error.message);

  const isRecoveryRoute =
    parsedUrl.hostname === 'forgot-password' ||
    parsedUrl.pathname.replace(/\/+$/, '').endsWith('/forgot-password');

  return authType === 'recovery' || isRecoveryRoute;
}

export async function updatePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return { id: data.user.id, email: data.user.email! };
}
