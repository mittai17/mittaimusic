/**
 * React Hook for Automatic Queue Management
 * 
 * Automatically fills the queue with recommended songs
 */

// @ts-ignore
import { useState, useEffect, useCallback, useRef } from 'react';
import { getAutoQueue, type Track, type QueueConfig } from '../engine/autoQueue.js';

interface UseAutoQueueOptions {
  minQueueSize?: number;
  maxQueueSize?: number;
  similarityThreshold?: number;
  diversityFactor?: number;
  autoRefill?: boolean;
  autoStart?: boolean;
}

interface UseAutoQueueReturn {
  queue: Track[];
  currentTrack: Track | null;
  queueSize: number;
  needsRefill: boolean;
  isPlaying: boolean;
  playNext: () => void;
  playTrack: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  refillQueue: () => Promise<void>;
  smartRefill: () => Promise<void>;
  initializeWithTrack: (track: Track) => Promise<void>;
  stats: {
    queueSize: number;
    historySize: number;
    needsRefill: boolean;
    averageSimilarity: number;
  };
}

/**
 * Hook for automatic queue management
 * 
 * @example
 * ```typescript
 * const {
 *   queue,
 *   currentTrack,
 *   playNext,
 *   playTrack,
 * } = useAutoQueue({
 *   minQueueSize: 5,
 *   maxQueueSize: 20,
 *   autoRefill: true,
 * });
 * 
 * // Play a track (automatically fills queue)
 * playTrack(track);
 * 
 * // Play next track (automatically refills when needed)
 * playNext();
 * ```
 */
export function useAutoQueue(options: UseAutoQueueOptions = {}): UseAutoQueueReturn {
  const {
    minQueueSize = 5,
    maxQueueSize = 20,
    similarityThreshold = 0.3,
    diversityFactor = 0.2,
    autoRefill = true,
    autoStart = false,
  } = options;

  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({
    queueSize: 0,
    historySize: 0,
    needsRefill: false,
    averageSimilarity: 0,
  });

  const autoQueueRef = useRef(getAutoQueue({
    minQueueSize,
    maxQueueSize,
    similarityThreshold,
    diversityFactor,
    autoRefill,
  }));

  // Update queue state
  const updateQueue = useCallback(() => {
    const autoQueue = autoQueueRef.current;
    setQueue(autoQueue.getQueue());
    setStats(autoQueue.getStats());
  }, []);

  // Initialize
  useEffect(() => {
    updateQueue();
  }, [updateQueue]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && queue.length > 0 && !currentTrack) {
      playNext();
    }
  }, [autoStart, queue.length, currentTrack]);

  /**
   * Play next track from queue
   */
  const playNext = useCallback(() => {
    const autoQueue = autoQueueRef.current;
    const nextTrack = autoQueue.getNextTrack();

    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
      console.log(`▶️ Playing: ${nextTrack.title} by ${nextTrack.artist}`);
    } else {
      setIsPlaying(false);
      console.log('⏸ Queue is empty');
    }

    updateQueue();
  }, [updateQueue]);

  /**
   * Play a specific track
   */
  const playTrack = useCallback(async (track: Track) => {
    const autoQueue = autoQueueRef.current;

    // Set as current track
    setCurrentTrack(track);
    setIsPlaying(true);

    // Add to history
    autoQueue.addToHistory(track.id);

    // Initialize queue if empty
    if (autoQueue.getQueueSize() === 0) {
      await autoQueue.initializeQueue(track.id);
    } else if (autoQueue.needsRefill()) {
      await autoQueue.refillQueue(track.id);
    }

    updateQueue();
    console.log(`▶️ Playing: ${track.title} by ${track.artist}`);
  }, [updateQueue]);

  /**
   * Add track to queue
   */
  const addToQueue = useCallback((track: Track) => {
    const autoQueue = autoQueueRef.current;
    autoQueue.addToQueue(track);
    updateQueue();
    console.log(`➕ Added to queue: ${track.title}`);
  }, [updateQueue]);

  /**
   * Remove track from queue
   */
  const removeFromQueue = useCallback((trackId: string) => {
    const autoQueue = autoQueueRef.current;
    const removed = autoQueue.removeFromQueue(trackId);
    
    if (removed) {
      updateQueue();
      console.log(`➖ Removed from queue: ${trackId}`);
    }
  }, [updateQueue]);

  /**
   * Clear queue
   */
  const clearQueue = useCallback(() => {
    const autoQueue = autoQueueRef.current;
    autoQueue.clearQueue();
    updateQueue();
    console.log('🗑 Queue cleared');
  }, [updateQueue]);

  /**
   * Manually refill queue
   */
  const refillQueue = useCallback(async () => {
    if (!currentTrack) {
      console.warn('No current track to base recommendations on');
      return;
    }

    const autoQueue = autoQueueRef.current;
    await autoQueue.refillQueue(currentTrack.id);
    updateQueue();
  }, [currentTrack, updateQueue]);

  /**
   * Smart refill based on listening history
   */
  const smartRefill = useCallback(async () => {
    const autoQueue = autoQueueRef.current;
    await autoQueue.smartRefill();
    updateQueue();
  }, [updateQueue]);

  /**
   * Initialize queue with a track
   */
  const initializeWithTrack = useCallback(async (track: Track) => {
    const autoQueue = autoQueueRef.current;
    await autoQueue.initializeQueue(track.id);
    setCurrentTrack(track);
    setIsPlaying(true);
    updateQueue();
  }, [updateQueue]);

  return {
    queue,
    currentTrack,
    queueSize: queue.length,
    needsRefill: stats.needsRefill,
    isPlaying,
    playNext,
    playTrack,
    addToQueue,
    removeFromQueue,
    clearQueue,
    refillQueue,
    smartRefill,
    initializeWithTrack,
    stats,
  };
}

/**
 * Hook for queue persistence
 * Saves and loads queue state from storage
 */
export function useQueuePersistence(storageKey: string = 'autoQueue') {
  const autoQueue = getAutoQueue();

  // Save queue state
  const saveQueue = useCallback(async () => {
    try {
      const state = autoQueue.exportState();
      const json = JSON.stringify(state);
      
      // Save to localStorage (web) or AsyncStorage (mobile)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, json);
      }
      
      console.log('✓ Queue saved');
    } catch (error) {
      console.error('Failed to save queue:', error);
    }
  }, [storageKey]);

  // Load queue state
  const loadQueue = useCallback(async () => {
    try {
      let json: string | null = null;

      // Load from localStorage (web) or AsyncStorage (mobile)
      if (typeof localStorage !== 'undefined') {
        json = localStorage.getItem(storageKey);
      }

      if (json) {
        const state = JSON.parse(json);
        autoQueue.importState(state);
        console.log('✓ Queue loaded');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to load queue:', error);
      return false;
    }
  }, [storageKey]);

  // Clear saved queue
  const clearSavedQueue = useCallback(async () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(storageKey);
      }
      console.log('✓ Saved queue cleared');
    } catch (error) {
      console.error('Failed to clear saved queue:', error);
    }
  }, [storageKey]);

  return {
    saveQueue,
    loadQueue,
    clearSavedQueue,
  };
}
