/**
 * Main Recommendation Engine
 * 
 * Provides high-level recommendation functions.
 * 
 * TODO: Integration with YouTube Data API:
 * 1. Use 'search' endpoint with 'relatedToVideoId' parameter
 * 2. Use 'videos' endpoint to get video details and statistics
 * 3. Use 'playlistItems' endpoint for playlist-based recommendations
 * 4. Implement caching to respect API quotas
 * 5. Add fallback to mock data when API is unavailable
 * 
 * Example YouTube API integration:
 * ```
 * const response = await fetch(
 *   `https://www.googleapis.com/youtube/v3/search?` +
 *   `relatedToVideoId=${videoId}&type=video&videoCategoryId=10&` +
 *   `key=${API_KEY}&part=snippet&maxResults=20`
 * );
 * ```
 */

import { getSimilar as getEmbeddingSimilar } from './item2vec.js';
import { getCoSimilar } from './cooccurrence.js';
import { getTrack, getTracksByGenre, getTracksByArtist, getAllTracks } from './features.js';
import { rankCandidates, type Candidate, type ScoredCandidate } from './ranker.js';

/**
 * Generate recommendations for a given track
 */
export function recommendForTrack(trackId: string, topN: number = 10): {
  trackId: string;
  track: { id: string; title: string; artist: string; genre: string };
  recommendations: ScoredCandidate[];
} {
  const track = getTrack(trackId);
  if (!track) {
    throw new Error(`Track ${trackId} not found`);
  }

  console.log(`\nGenerating recommendations for: ${track.title} by ${track.artist}`);

  // Collect candidates from multiple sources
  const candidates: Candidate[] = [];
  const seenIds = new Set<string>();

  // 1. Embedding-based candidates
  const embeddingSimilar = getEmbeddingSimilar(trackId, 10);
  for (const item of embeddingSimilar) {
    if (!seenIds.has(item.id)) {
      candidates.push({ id: item.id, source: 'embedding' });
      seenIds.add(item.id);
    }
  }

  // 2. Co-occurrence candidates
  const coSimilar = getCoSimilar(trackId, 10);
  for (const item of coSimilar) {
    if (!seenIds.has(item.id)) {
      candidates.push({ id: item.id, source: 'cooccurrence' });
      seenIds.add(item.id);
    }
  }

  // 3. Same genre candidates
  const genreTracks = getTracksByGenre(track.genre, 10);
  for (const genreTrack of genreTracks) {
    if (!seenIds.has(genreTrack.id) && genreTrack.id !== trackId) {
      candidates.push({ id: genreTrack.id, source: 'genre' });
      seenIds.add(genreTrack.id);
    }
  }

  // 4. Same artist candidates
  const artistTracks = getTracksByArtist(track.artist, 5);
  for (const artistTrack of artistTracks) {
    if (!seenIds.has(artistTrack.id) && artistTrack.id !== trackId) {
      candidates.push({ id: artistTrack.id, source: 'artist' });
      seenIds.add(artistTrack.id);
    }
  }

  console.log(`  Collected ${candidates.length} candidates`);

  // Rank candidates
  const ranked = rankCandidates(trackId, candidates, topN);

  console.log(`  Returning top ${ranked.length} recommendations`);

  return {
    trackId,
    track: {
      id: track.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
    },
    recommendations: ranked,
  };
}

/**
 * Generate recommendations for a user based on their listening history
 * 
 * TODO: Implement user-based collaborative filtering
 * - Track user listening history
 * - Find similar users
 * - Recommend tracks popular among similar users
 */
export function recommendForUser(userId: string, topN: number = 10) {
  // For now, return popular tracks as a simple baseline
  // In production, this would use user history and preferences

  console.log(`\nGenerating recommendations for user: ${userId}`);

  const allTracks = getAllTracks();
  const candidates: Candidate[] = allTracks.map(track => ({
    id: track.id,
    source: 'popular',
  }));

  // Use a dummy track for ranking (or implement user profile)
  // For now, just return popular tracks
  const popular = allTracks
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, topN)
    .map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      score: track.popularity / 100,
      breakdown: {
        embedding: 0,
        cooccurrence: 0,
        genre: 0,
        artist: 0,
        audioFeatures: 0,
        tags: 0,
        popularity: track.popularity / 100,
      },
    }));

  return {
    userId,
    recommendations: popular,
  };
}

/**
 * Get similar tracks (simplified interface)
 */
export function getSimilarTracks(trackId: string, limit: number = 10): ScoredCandidate[] {
  const result = recommendForTrack(trackId, limit);
  return result.recommendations;
}
