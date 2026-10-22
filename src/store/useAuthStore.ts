import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

import type { UserProfile } from '../types/orders';

const KEYCHAIN_SERVICE = 'com.shopai.auth';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isHydrated: boolean;
  isUnlocked: boolean;
  hydrate: () => Promise<void>;
  login: (token: string, user: UserProfile) => Promise<void>;
  unlock: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: null,
  isHydrated: false,
  isUnlocked: false,
  hydrate: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
      if (credentials) {
        const parsed = JSON.parse(credentials.username) as UserProfile;
        set({ token: credentials.password, user: parsed });
      }
    } finally {
      set({ isHydrated: true });
    }
  },
  login: async (token, user) => {
    await Keychain.setGenericPassword(JSON.stringify(user), token, { service: KEYCHAIN_SERVICE });
    set({ token, user, isUnlocked: true, isHydrated: true });
  },
  unlock: () => set({ isUnlocked: true }),
  logout: async () => {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    set({ token: null, user: null, isUnlocked: false, isHydrated: true });
  },
}));

export const getAuthToken = (): string | null => useAuthStore.getState().token;
