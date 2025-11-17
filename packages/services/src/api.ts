/**
 * API service with mock data
 * TODO: Replace mock functions with real API calls to your backend
 * TODO: Integrate YouTube Data API v3 for playlist import (requires API key)
 * 
 * IMPORTANT: If using YouTube content:
 * - Use official YouTube Data API v3
 * - Follow YouTube API Services Terms: https://developers.google.com/youtube/terms/api-services-terms-of-service
 * - Do NOT scrape or extract audio in violation of terms
 * - Obtain proper music licensing for monetization
 */

import type { HomeData, SearchResult, Playlist, Track } from './types';

// Mock data will be loaded from JSON files in apps
let mockData: {
  homeData?: HomeData;
  playlists?: Playlist[];
  tracks?: Track[];
} = {};

/**
 * Initialize mock data (called from apps)
 */
export const initMockData = (data: typeof mockData) => {
  mockData = data;
};

/**
 * Get home screen data (featured playlists, trending, genres, recommendations)
 * TODO: Replace with real API call: GET /api/home
 */
export const getHomeData = async (): Promise<HomeData> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (mockData.homeData) {
    return mockData.homeData;
  }

  // Fallback empty data
  return {
    featuredPlaylists: [],
    trendingPlaylists: [],
    genres: [],
    recommendedTracks: [],
  };
};

/**
 * Search for tracks, artists, and playlists
 * TODO: Replace with real API call: GET /api/search?q={query}
 * TODO: Add pagination support
 */
export const search = async (query: string): Promise<SearchResult> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!query.trim()) {
    return { tracks: [], artists: [], playlists: [] };
  }

  const lowerQuery = query.toLowerCase();
  const tracks = (mockData.tracks || []).filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.artist.toLowerCase().includes(lowerQuery)
  );
  const playlists = (mockData.playlists || []).filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
  );

  // Mock artists from tracks
  const artistMap = new Map<string, { id: string; name: string; avatarUrl: string }>();
  tracks.forEach((t) => {
    const artistId = t.artistId || t.id;
    if (!artistMap.has(artistId)) {
      artistMap.set(artistId, {
        id: artistId,
        name: t.artist,
        avatarUrl: t.coverUrl, // Using track cover as placeholder
      });
    }
  });
  const artists = Array.from(artistMap.values()).filter((a) =>
    a.name.toLowerCase().includes(lowerQuery)
  );

  return { tracks, artists, playlists };
};

/**
 * Get playlist by ID
 * TODO: Replace with real API call: GET /api/playlists/{id}
 */
export const getPlaylist = async (id: string): Promise<Playlist | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const playlist = (mockData.playlists || []).find((p) => p.id === id);
  return playlist || null;
};

/**
 * Import playlist from YouTube URL
 * 
 * Uses YouTube Data API v3 to fetch playlist metadata
 * For actual playback, use YouTube IFrame Player API (see apps/web/components/YouTubePlayer.tsx)
 * 
 * IMPORTANT LEGAL NOTES:
 * - YouTube Data API is for metadata only, NOT audio extraction
 * - You cannot download or stream YouTube audio without proper licensing
 * - For audio playback, you must use official YouTube IFrame Player API
 * - See: https://developers.google.com/youtube/terms/api-services-terms-of-service
 */
export const importPlaylistFromYouTube = async (_url: string): Promise<Playlist> => {
  // This function is a placeholder - actual implementation is in apps/web/lib/youtubeApi.ts
  // Use importPlaylistFromYouTubeWeb() from the web app instead
  throw new Error(
    'YouTube import is only available in web environment. Use importPlaylistFromYouTubeWeb() from apps/web/lib/youtubeApi.ts'
  );
};

/**
 * Get track by ID
 * TODO: Replace with real API call: GET /api/tracks/{id}
 */
export const getTrack = async (id: string): Promise<Track | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const track = (mockData.tracks || []).find((t) => t.id === id);
  return track || null;
};

