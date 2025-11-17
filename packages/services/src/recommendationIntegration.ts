/**
 * Integration helpers for the recommendation engine
 */

import { getRecommendationEngine } from './recommendationEngine';
import type { ListeningEvent } from './recommendationEngine';
import type { Track } from './types';

// Storage keys
const PROFILE_STORAGE_KEY = 'youtify_user_profile';
const LAST_SYNC_KEY = 'youtify_last_sync';

/**
 * Initialize recommendation engine with stored profile
 */
export function initializeRecommendations(): void {
  const engine = getRecommendationEngine();
  
  // Load profile from storage
  if (typeof window !== 'undefined') {
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      engine.importProfile(storedProfile);
      console.log('Recommendation profile loaded');
    }
  }
}

/**
 * Save recommendation profile to storage
 */
export function saveRecommendationProfile(): void {
  const engine = getRecommendationEngine();
  
  if (typeof window !== 'undefined') {
    const profileData = engine.exportProfile();
    localStorage.setItem(PROFILE_STORAGE_KEY, profileData);
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  }
}

/**
 * Track when a song is played
 */
export function trackSongPlay(track: Track, startTime: number = Date.now()): void {
  const engine = getRecommendationEngine();
  engine.addTrack(track);
  
  // Store start time for later completion tracking
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`play_start_${track.id}`, startTime.toString());
  }
}

/**
 * Track when a song is completed or skipped
 */
export function trackSongEnd(
  trackId: string,
  completed: boolean,
  skipped: boolean = false
): void {
  const engine = getRecommendationEngine();
  
  if (typeof window !== 'undefined') {
    const startTimeStr = sessionStorage.getItem(`play_start_${trackId}`);
    const startTime = startTimeStr ? parseInt(startTimeStr) : Date.now();
    const duration = (Date.now() - startTime) / 1000; // in seconds
    
    const event: ListeningEvent = {
      trackId,
      timestamp: startTime,
      duration,
      completed,
      skipped,
    };
    
    engine.recordListeningEvent(event);
    sessionStorage.removeItem(`play_start_${trackId}`);
    
    // Save profile periodically
    saveRecommendationProfile();
  }
}

/**
 * Track when a song is liked
 */
export function trackSongLike(trackId: string): void {
  const engine = getRecommendationEngine();
  engine.likeTrack(trackId);
  saveRecommendationProfile();
}

/**
 * Track when a song is disliked
 */
export function trackSongDislike(trackId: string): void {
  const engine = getRecommendationEngine();
  engine.dislikeTrack(trackId);
  saveRecommendationProfile();
}

/**
 * Get personalized recommendations
 */
export function getPersonalizedRecommendations(
  count: number = 10,
  excludeIds: string[] = []
): Track[] {
  const engine = getRecommendationEngine();
  return engine.getRecommendations(count, excludeIds);
}

/**
 * Get similar tracks
 */
export function getSimilarTracks(trackId: string, count: number = 10): Track[] {
  const engine = getRecommendationEngine();
  return engine.getSimilarTracks(trackId, count);
}

/**
 * Get tracks by mood
 */
export function getTracksByMood(mood: string, count: number = 10): Track[] {
  const engine = getRecommendationEngine();
  return engine.getTracksByMood(mood, count);
}

/**
 * Get tracks by genre
 */
export function getTracksByGenre(genre: string, count: number = 10): Track[] {
  const engine = getRecommendationEngine();
  return engine.getTracksByGenre(genre, count);
}

/**
 * Get time-based playlist
 */
export function getTimeBasedPlaylist(count: number = 20): Track[] {
  const engine = getRecommendationEngine();
  return engine.getTimeBasedPlaylist(count);
}

/**
 * Get user statistics
 */
export function getUserMusicStats() {
  const engine = getRecommendationEngine();
  return engine.getUserStats();
}

/**
 * Clear all recommendation data
 */
export function clearRecommendationData(): void {
  const engine = getRecommendationEngine();
  engine.clearProfile();
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  }
}

/**
 * Auto-save profile periodically
 */
export function startAutoSave(intervalMs: number = 60000): () => void {
  const interval = setInterval(() => {
    saveRecommendationProfile();
  }, intervalMs);
  
  return () => clearInterval(interval);
}

/**
 * Convert YouTube video to Track format
 */
export function youtubeVideoToTrack(video: any): Track {
  return {
    id: video.videoId,
    title: video.title,
    artist: video.channelTitle,
    artistId: `yt-${video.channelTitle}`,
    genre: extractGenre(video.title),
    duration: 0,
    coverUrl: video.thumbnail,
    audioUrl: `youtube:${video.videoId}`,
    tags: extractTags(video.title),
    mood: extractMood(video.title),
    tempo: extractTempo(video.title),
    popularity: 50, // Default
  };
}

/**
 * Extract genre from title
 */
function extractGenre(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('pop')) return 'Pop';
  if (lowerTitle.includes('rock')) return 'Rock';
  if (lowerTitle.includes('hip hop') || lowerTitle.includes('rap')) return 'Hip Hop';
  if (lowerTitle.includes('jazz')) return 'Jazz';
  if (lowerTitle.includes('classical')) return 'Classical';
  if (lowerTitle.includes('electronic') || lowerTitle.includes('edm')) return 'Electronic';
  if (lowerTitle.includes('country')) return 'Country';
  if (lowerTitle.includes('r&b') || lowerTitle.includes('rnb')) return 'R&B';
  if (lowerTitle.includes('indie')) return 'Indie';
  if (lowerTitle.includes('metal')) return 'Metal';
  
  return 'Other';
}

/**
 * Extract tags from title
 */
function extractTags(title: string): string[] {
  const tags: string[] = [];
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('official')) tags.push('official');
  if (lowerTitle.includes('lyric')) tags.push('lyrics');
  if (lowerTitle.includes('remix')) tags.push('remix');
  if (lowerTitle.includes('cover')) tags.push('cover');
  if (lowerTitle.includes('acoustic')) tags.push('acoustic');
  if (lowerTitle.includes('live')) tags.push('live');
  if (lowerTitle.includes('unplugged')) tags.push('unplugged');
  
  return tags;
}

/**
 * Extract mood from title
 */
function extractMood(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('sad') || lowerTitle.includes('melancholy')) return 'sad';
  if (lowerTitle.includes('happy') || lowerTitle.includes('upbeat')) return 'happy';
  if (lowerTitle.includes('chill') || lowerTitle.includes('relax')) return 'relaxed';
  if (lowerTitle.includes('energy') || lowerTitle.includes('pump')) return 'energetic';
  if (lowerTitle.includes('romantic') || lowerTitle.includes('love')) return 'romantic';
  if (lowerTitle.includes('angry') || lowerTitle.includes('aggressive')) return 'aggressive';
  
  return 'neutral';
}

/**
 * Extract tempo from title
 */
function extractTempo(title: string): 'slow' | 'medium' | 'fast' {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('slow') || lowerTitle.includes('ballad')) return 'slow';
  if (lowerTitle.includes('fast') || lowerTitle.includes('upbeat')) return 'fast';
  
  return 'medium';
}
