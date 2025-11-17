/**
 * Authentication service (mock implementation)
 * TODO: Replace with real OAuth implementation
 * 
 * For production:
 * - Web: Use NextAuth.js, Auth0, or Firebase Auth
 * - Mobile: Use expo-auth-session for OAuth flows
 * - Backend: Implement JWT token validation and refresh
 */

import { storage } from './storage';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  subscriptionTier?: 'free' | 'premium';
}

let currentUser: User | null = null;
const authSubscribers = new Set<(user: User | null) => void>();

/**
 * Initialize auth (load persisted user)
 */
export const initAuth = async () => {
  try {
    const saved = await storage.getItem('user');
    if (saved) {
      currentUser = JSON.parse(saved);
      notifyAuthSubscribers();
    }
  } catch (e) {
    console.error('Failed to load auth state:', e);
  }
};

const notifyAuthSubscribers = () => {
  authSubscribers.forEach((cb) => cb(currentUser));
};

/**
 * Mock sign in
 * TODO: Replace with real OAuth flow
 * 
 * Example for web (NextAuth.js):
 * ```typescript
 * import { signIn } from 'next-auth/react';
 * await signIn('google');
 * ```
 * 
 * Example for mobile (expo-auth-session):
 * ```typescript
 * import * as AuthSession from 'expo-auth-session';
 * const result = await AuthSession.startAsync({...});
 * ```
 */
export const signIn = async (email: string, _password: string): Promise<User> => {
  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user: User = {
    id: 'mock-user-1',
    email,
    name: email.split('@')[0],
    avatarUrl: '/mock/avatar-placeholder.jpg',
    subscriptionTier: 'free',
  };

  currentUser = user;
  await storage.setItem('user', JSON.stringify(user));
  notifyAuthSubscribers();

  console.warn('[TODO] Replace with real OAuth authentication');
  return user;
};

/**
 * Mock sign out
 */
export const signOut = async () => {
  currentUser = null;
  await storage.removeItem('user');
  notifyAuthSubscribers();
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  authSubscribers.add(callback);
  return () => {
    authSubscribers.delete(callback);
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

