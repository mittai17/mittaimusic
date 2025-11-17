/**
 * Cross-platform player adapter
 * Abstracts expo-av (mobile) and react-player (web) behind a unified API
 * 
 * TODO for production:
 * - Mobile: Integrate react-native-track-player for background audio and lock screen controls
 *   See: https://github.com/doublesymmetry/react-native-track-player
 * - Mobile: Use expo-media-session for media controls and notifications
 *   See: https://docs.expo.dev/versions/latest/sdk/media-library/
 * - Web: Implement proper audio context management and error handling
 * - Add support for playlists, shuffle, repeat modes
 * - Implement proper state persistence across app restarts
 */

import type { Track, PlayerState } from './types';
import { storage } from './storage';

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Player implementations (will be set dynamically)
let playerImpl: {
  play: (url: string) => Promise<void>;
  pause: () => Promise<void>;
  seek: (seconds: number) => Promise<void>;
  getPosition: () => Promise<number>;
  getDuration: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  onPositionUpdate: (callback: (position: number) => void) => () => void;
  onStateChange: (callback: (isPlaying: boolean) => void) => () => void;
};

// Initialize player based on platform
if (isWeb) {
  // Web implementation using HTML5 Audio (react-player can be added later)
  let audioElement: HTMLAudioElement | null = null;
  let positionUpdateInterval: NodeJS.Timeout | null = null;
  let positionCallbacks: Set<(position: number) => void> = new Set();
  let stateCallbacks: Set<(isPlaying: boolean) => void> = new Set();

  playerImpl = {
    play: async (url: string) => {
      // Skip HTML5 Audio for YouTube URLs - handled by YouTubePlayer component
      if (url.startsWith('youtube:')) {
        return;
      }
      
      if (!audioElement || audioElement.src !== url) {
        if (audioElement) {
          audioElement.pause();
        }
        audioElement = new Audio(url);
        audioElement.addEventListener('play', () => {
          stateCallbacks.forEach((cb) => cb(true));
        });
        audioElement.addEventListener('pause', () => {
          stateCallbacks.forEach((cb) => cb(false));
        });
        audioElement.addEventListener('ended', () => {
          stateCallbacks.forEach((cb) => cb(false));
        });
      }
      await audioElement.play();
    },
    pause: async () => {
      // YouTube pause is handled by YouTubePlayer component
      if (audioElement) {
        audioElement.pause();
      }
    },
    seek: async (seconds: number) => {
      if (audioElement) {
        audioElement.currentTime = seconds;
      }
    },
    getPosition: async () => {
      return audioElement?.currentTime || 0;
    },
    getDuration: async () => {
      return audioElement?.duration || 0;
    },
    setVolume: async (volume: number) => {
      if (audioElement) {
        audioElement.volume = Math.max(0, Math.min(1, volume));
      }
    },
    onPositionUpdate: (callback: (position: number) => void) => {
      positionCallbacks.add(callback);
      if (!positionUpdateInterval) {
        positionUpdateInterval = setInterval(() => {
          if (audioElement) {
            const pos = audioElement.currentTime;
            positionCallbacks.forEach((cb) => cb(pos));
          }
        }, 100);
      }
      return () => {
        positionCallbacks.delete(callback);
        if (positionCallbacks.size === 0 && positionUpdateInterval) {
          clearInterval(positionUpdateInterval);
          positionUpdateInterval = null;
        }
      };
    },
    onStateChange: (callback: (isPlaying: boolean) => void) => {
      stateCallbacks.add(callback);
      return () => {
        stateCallbacks.delete(callback);
      };
    },
  };
} else {
  // React Native implementation using expo-av
  // This will be initialized when the module loads in React Native context
  playerImpl = {
    play: async () => {
      console.warn('[TODO] Initialize expo-av Audio.Sound in React Native context');
    },
    pause: async () => {},
    seek: async () => {},
    getPosition: async () => 0,
    getDuration: async () => 0,
    setVolume: async () => {},
    onPositionUpdate: () => () => {},
    onStateChange: () => () => {},
  };
}

// Player state store
let currentState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  position: 0,
  queue: [],
  queueIndex: -1,
  volume: 1.0,
};

// State subscribers
const stateSubscribers = new Set<(state: PlayerState) => void>();

const notifySubscribers = () => {
  stateSubscribers.forEach((cb) => cb(currentState));
};

/**
 * Initialize player (call this in your app entry point)
 * For React Native, this sets up expo-av
 */
export const initPlayer = async () => {
  if (!isWeb) {
    // TODO: Initialize expo-av Audio.Sound
    // const { Audio } = require('expo-av');
    // const sound = new Audio.Sound();
    console.log('[TODO] Initialize expo-av player in React Native');
  }

  // Load persisted state
  try {
    const saved = await storage.getItem('playerState');
    if (saved) {
      const parsed = JSON.parse(saved);
      currentState = { ...currentState, ...parsed };
      notifySubscribers();
    }
  } catch (e) {
    console.error('Failed to load player state:', e);
  }
};

/**
 * Play a track
 */
export const play = async (track: Track) => {
  currentState.currentTrack = track;
  currentState.isPlaying = true;
  currentState.position = 0;
  notifySubscribers();

  await playerImpl.play(track.audioUrl);
  await persistState();
};

/**
 * Pause playback
 */
export const pause = async () => {
  currentState.isPlaying = false;
  notifySubscribers();
  await playerImpl.pause();
  await persistState();
};

/**
 * Resume playback
 */
export const resume = async () => {
  currentState.isPlaying = true;
  notifySubscribers();
  if (currentState.currentTrack) {
    await playerImpl.play(currentState.currentTrack.audioUrl);
  }
  await persistState();
};

/**
 * Seek to position in seconds
 */
export const seek = async (seconds: number) => {
  currentState.position = seconds;
  notifySubscribers();
  await playerImpl.seek(seconds);
};

/**
 * Play next track in queue
 */
export const next = async () => {
  if (currentState.queue.length === 0) return;

  currentState.queueIndex = Math.min(
    currentState.queueIndex + 1,
    currentState.queue.length - 1
  );
  const track = currentState.queue[currentState.queueIndex];
  await play(track);
};

/**
 * Play previous track in queue
 */
export const previous = async () => {
  if (currentState.queue.length === 0) return;

  currentState.queueIndex = Math.max(currentState.queueIndex - 1, 0);
  const track = currentState.queue[currentState.queueIndex];
  await play(track);
};

/**
 * Get current queue
 */
export const getQueue = (): Track[] => {
  return [...currentState.queue];
};

/**
 * Add track to queue
 */
export const addToQueue = (track: Track) => {
  currentState.queue.push(track);
  if (currentState.queueIndex === -1 && currentState.queue.length === 1) {
    currentState.queueIndex = 0;
  }
  notifySubscribers();
  persistState();
};

/**
 * Remove track from queue
 */
export const removeFromQueue = (trackId: string) => {
  const index = currentState.queue.findIndex(t => t.id === trackId);
  if (index !== -1) {
    currentState.queue.splice(index, 1);
    if (currentState.queueIndex >= index) {
      currentState.queueIndex = Math.max(0, currentState.queueIndex - 1);
    }
    notifySubscribers();
    persistState();
  }
};

/**
 * Clear queue
 */
export const clearQueue = () => {
  currentState.queue = [];
  currentState.queueIndex = -1;
  notifySubscribers();
  persistState();
};

/**
 * Get current player state
 */
export const getState = (): PlayerState => {
  return { ...currentState };
};

/**
 * Subscribe to state changes
 */
export const subscribe = (callback: (state: PlayerState) => void) => {
  stateSubscribers.add(callback);
  return () => {
    stateSubscribers.delete(callback);
  };
};

/**
 * Persist player state to storage
 */
export const persistState = async () => {
  try {
    const stateToSave = {
      currentTrack: currentState.currentTrack,
      queue: currentState.queue,
      queueIndex: currentState.queueIndex,
      volume: currentState.volume,
      position: currentState.position,
    };
    await storage.setItem('playerState', JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to persist player state:', e);
  }
};

/**
 * Set volume (0.0 to 1.0)
 */
export const setVolume = async (volume: number) => {
  currentState.volume = Math.max(0, Math.min(1, volume));
  await playerImpl.setVolume(volume);
  await persistState();
};

// Set up position updates
if (isWeb) {
  playerImpl.onPositionUpdate((position) => {
    currentState.position = position;
    notifySubscribers();
  });
}

