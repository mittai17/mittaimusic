/**
 * Feature Engineering for Recommendations
 * 
 * Computes various similarity and scoring features for tracks.
 * 
 * TODO: To integrate with YouTube Data API:
 * - Use 'search' endpoint to find tracks by genre/artist
 * - Use 'videos' endpoint to get video statistics (viewCount, likeCount)
 * - Use 'relatedVideos' parameter in search for similar content
 * - Use video metadata (tags, description) for content-based filtering
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  popularity: number;
  tempo: number;
  energy: number;
  danceability: number;
  tags: string[];
}

let tracks: Track[] = [];
let trackMap: Map<string, Track> = new Map();

/**
 * Load track metadata
 */
export function loadTracks(): void {
  const tracksPath = path.join(__dirname, '../../data/tracks.json');
  const data = fs.readFileSync(tracksPath, 'utf-8');
  tracks = JSON.parse(data);

  trackMap = new Map();
  for (const track of tracks) {
    trackMap.set(track.id, track);
  }

  console.log(`✓ Loaded ${tracks.length} tracks`);
}

/**
 * Get track by ID
 */
export function getTrack(trackId: string): Track | undefined {
  return trackMap.get(trackId);
}

/**
 * Get all tracks
 */
export function getAllTracks(): Track[] {
  return tracks;
}

/**
 * Check if two tracks are from the same genre
 */
export function genreMatch(trackA: string, trackB: string): number {
  const a = trackMap.get(trackA);
  const b = trackMap.get(trackB);

  if (!a || !b) return 0;

  return a.genre === b.genre ? 1 : 0;
}

/**
 * Check if two tracks are from the same artist
 */
export function artistMatch(trackA: string, trackB: string): number {
  const a = trackMap.get(trackA);
  const b = trackMap.get(trackB);

  if (!a || !b) return 0;

  return a.artist === b.artist ? 1 : 0;
}

/**
 * Compute audio feature similarity (tempo, energy, danceability)
 */
export function audioFeatureSimilarity(trackA: string, trackB: string): number {
  const a = trackMap.get(trackA);
  const b = trackMap.get(trackB);

  if (!a || !b) return 0;

  // Normalize differences
  const tempoDiff = Math.abs(a.tempo - b.tempo) / 200; // Max tempo ~200
  const energyDiff = Math.abs(a.energy - b.energy);
  const danceabilityDiff = Math.abs(a.danceability - b.danceability);

  // Average similarity (1 - difference)
  const similarity = 1 - (tempoDiff + energyDiff + danceabilityDiff) / 3;

  return Math.max(0, similarity);
}

/**
 * Compute tag overlap similarity
 */
export function tagSimilarity(trackA: string, trackB: string): number {
  const a = trackMap.get(trackA);
  const b = trackMap.get(trackB);

  if (!a || !b) return 0;

  const tagsA = new Set(a.tags);
  const tagsB = new Set(b.tags);

  const intersection = new Set([...tagsA].filter(tag => tagsB.has(tag)));
  const union = new Set([...tagsA, ...tagsB]);

  if (union.size === 0) return 0;

  // Jaccard similarity
  return intersection.size / union.size;
}

/**
 * Get popularity score for a track (normalized 0-1)
 */
export function popularityScore(trackId: string): number {
  const track = trackMap.get(trackId);
  if (!track) return 0;

  // Normalize popularity (assuming max is 100)
  return track.popularity / 100;
}

/**
 * Get tracks by genre
 */
export function getTracksByGenre(genre: string, limit: number = 10): Track[] {
  return tracks
    .filter(track => track.genre.toLowerCase() === genre.toLowerCase())
    .slice(0, limit);
}

/**
 * Get tracks by artist
 */
export function getTracksByArtist(artist: string, limit: number = 10): Track[] {
  return tracks
    .filter(track => track.artist.toLowerCase() === artist.toLowerCase())
    .slice(0, limit);
}

/**
 * Get popular tracks
 */
export function getPopularTracks(limit: number = 10): Track[] {
  return [...tracks]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}
