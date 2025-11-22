/**
 * Queue Management
 * Manage playback queue
 */

export interface QueueItem {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

const QUEUE_KEY = 'mittai-music-queue';
const CURRENT_INDEX_KEY = 'mittai-music-current-index';

// Get queue
export const getQueue = (): QueueItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading queue:', error);
    return [];
  }
};

// Set queue
export const setQueue = (queue: QueueItem[]): boolean => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch (error) {
    console.error('Error saving queue:', error);
    return false;
  }
};

// Add to queue
export const addToQueue = (song: QueueItem): boolean => {
  try {
    const queue = getQueue();
    queue.push(song);
    return setQueue(queue);
  } catch (error) {
    console.error('Error adding to queue:', error);
    return false;
  }
};

// Add multiple to queue
export const addMultipleToQueue = (songs: QueueItem[]): boolean => {
  try {
    const queue = getQueue();
    queue.push(...songs);
    return setQueue(queue);
  } catch (error) {
    console.error('Error adding multiple to queue:', error);
    return false;
  }
};

// Remove from queue
export const removeFromQueue = (index: number): boolean => {
  try {
    const queue = getQueue();
    queue.splice(index, 1);
    return setQueue(queue);
  } catch (error) {
    console.error('Error removing from queue:', error);
    return false;
  }
};

// Clear queue
export const clearQueue = (): boolean => {
  try {
    localStorage.removeItem(QUEUE_KEY);
    localStorage.removeItem(CURRENT_INDEX_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing queue:', error);
    return false;
  }
};

// Get current index
export const getCurrentIndex = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = localStorage.getItem(CURRENT_INDEX_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    return 0;
  }
};

// Set current index
export const setCurrentIndex = (index: number): boolean => {
  try {
    localStorage.setItem(CURRENT_INDEX_KEY, index.toString());
    return true;
  } catch (error) {
    console.error('Error setting current index:', error);
    return false;
  }
};

// Get next song
export const getNextSong = (): QueueItem | null => {
  const queue = getQueue();
  const currentIndex = getCurrentIndex();
  
  if (currentIndex < queue.length - 1) {
    return queue[currentIndex + 1];
  }
  
  return null;
};

// Get previous song
export const getPreviousSong = (): QueueItem | null => {
  const queue = getQueue();
  const currentIndex = getCurrentIndex();
  
  if (currentIndex > 0) {
    return queue[currentIndex - 1];
  }
  
  return null;
};

// Play next
export const playNext = (): QueueItem | null => {
  const nextSong = getNextSong();
  if (nextSong) {
    setCurrentIndex(getCurrentIndex() + 1);
  }
  return nextSong;
};

// Play previous
export const playPrevious = (): QueueItem | null => {
  const prevSong = getPreviousSong();
  if (prevSong) {
    setCurrentIndex(getCurrentIndex() - 1);
  }
  return prevSong;
};

// Shuffle queue
export const shuffleQueue = (): boolean => {
  try {
    const queue = getQueue();
    const currentIndex = getCurrentIndex();
    const currentSong = queue[currentIndex];
    
    // Remove current song
    queue.splice(currentIndex, 1);
    
    // Shuffle remaining
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    
    // Put current song back at start
    queue.unshift(currentSong);
    setCurrentIndex(0);
    
    return setQueue(queue);
  } catch (error) {
    console.error('Error shuffling queue:', error);
    return false;
  }
};

// Get queue length
export const getQueueLength = (): number => {
  return getQueue().length;
};
