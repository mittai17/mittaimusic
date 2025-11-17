/**
 * Cross-platform storage adapter
 * Uses AsyncStorage on React Native and localStorage on web
 */

let storageImpl: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

// Initialize storage based on platform
if (typeof window !== 'undefined' && window.localStorage) {
  // Web platform
  storageImpl = {
    getItem: async (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('localStorage.getItem error:', e);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('localStorage.setItem error:', e);
      }
    },
    removeItem: async (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('localStorage.removeItem error:', e);
      }
    },
  };
} else {
  // React Native platform - will be set dynamically
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  storageImpl = {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (e) {
        console.error('AsyncStorage.getItem error:', e);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        console.error('AsyncStorage.setItem error:', e);
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (e) {
        console.error('AsyncStorage.removeItem error:', e);
      }
    },
  };
}

export const storage = {
  getItem: storageImpl.getItem,
  setItem: storageImpl.setItem,
  removeItem: storageImpl.removeItem,
};

/**
 * Offline caching hooks (stubbed for now)
 * TODO: Implement proper offline caching with:
 * - Service Worker for web (workbox, etc.)
 * - expo-file-system for mobile asset caching
 * - Cache headers and ETag support
 * - Background sync for playlists
 */
export const useOfflineCache = () => {
  // Stub implementation
  return {
    cacheTrack: async (_trackId: string) => {
      console.log('[TODO] Implement track caching for offline playback');
    },
    getCachedTrack: async (_trackId: string) => {
      console.log('[TODO] Implement cached track retrieval');
      return null;
    },
    clearCache: async () => {
      console.log('[TODO] Implement cache clearing');
    },
  };
};

