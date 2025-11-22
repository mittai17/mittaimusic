/**
 * Favorites Management
 * Store and manage favorite songs
 */

export interface FavoriteSong {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  addedAt: number;
}

const FAVORITES_KEY = 'mittai-music-favorites';

// Get all favorites
export const getFavorites = (): FavoriteSong[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

// Add to favorites
export const addToFavorites = (song: Omit<FavoriteSong, 'addedAt'>): boolean => {
  try {
    const favorites = getFavorites();
    
    // Check if already exists
    if (favorites.some(fav => fav.id === song.id)) {
      return false;
    }
    
    const newFavorite: FavoriteSong = {
      ...song,
      addedAt: Date.now(),
    };
    
    favorites.unshift(newFavorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

// Remove from favorites
export const removeFromFavorites = (songId: string): boolean => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.id !== songId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// Check if song is favorite
export const isFavorite = (songId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === songId);
};

// Clear all favorites
export const clearFavorites = (): boolean => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};

// Get favorites count
export const getFavoritesCount = (): number => {
  return getFavorites().length;
};
