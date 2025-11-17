/**
 * Music Recommendation Engine
 * Provides personalized music recommendations based on user behavior
 */

import { Track } from './types';

export interface UserProfile {
  userId: string;
  listeningHistory: ListeningEvent[];
  likedTracks: string[];
  dislikedTracks: string[];
  favoriteGenres: Map<string, number>;
  favoriteArtists: Map<string, number>;
  listeningTime: Map<string, number>; // hour of day -> count
  skipRate: number;
  averageSessionLength: number;
}

export interface ListeningEvent {
  trackId: string;
  timestamp: number;
  duration: number; // how long they listened
  completed: boolean; // did they finish the song
  skipped: boolean;
  liked?: boolean;
}

export interface RecommendationScore {
  trackId: string;
  score: number;
  reasons: string[];
}

export class MusicRecommendationEngine {
  private userProfile: UserProfile;
  private trackDatabase: Map<string, Track>;
  private similarityCache: Map<string, Map<string, number>>;

  constructor() {
    this.userProfile = this.initializeUserProfile();
    this.trackDatabase = new Map();
    this.similarityCache = new Map();
  }

  private initializeUserProfile(): UserProfile {
    return {
      userId: 'default',
      listeningHistory: [],
      likedTracks: [],
      dislikedTracks: [],
      favoriteGenres: new Map(),
      favoriteArtists: new Map(),
      listeningTime: new Map(),
      skipRate: 0,
      averageSessionLength: 0,
    };
  }

  /**
   * Add a track to the database
   */
  addTrack(track: Track): void {
    this.trackDatabase.set(track.id, track);
  }

  /**
   * Record a listening event
   */
  recordListeningEvent(event: ListeningEvent): void {
    this.userProfile.listeningHistory.push(event);

    // Update user profile
    const track = this.trackDatabase.get(event.trackId);
    if (track) {
      // Update genre preferences
      if (track.genre) {
        const genreCount = this.userProfile.favoriteGenres.get(track.genre) || 0;
        this.userProfile.favoriteGenres.set(track.genre, genreCount + 1);
      }

      // Update artist preferences
      if (track.artistId) {
        const artistCount = this.userProfile.favoriteArtists.get(track.artistId) || 0;
        this.userProfile.favoriteArtists.set(track.artistId, artistCount + 1);
      }

      // Update listening time
      const hour = new Date(event.timestamp).getHours().toString();
      const timeCount = this.userProfile.listeningTime.get(hour) || 0;
      this.userProfile.listeningTime.set(hour, timeCount + 1);
    }

    // Update skip rate
    const totalEvents = this.userProfile.listeningHistory.length;
    const skippedEvents = this.userProfile.listeningHistory.filter(e => e.skipped).length;
    this.userProfile.skipRate = skippedEvents / totalEvents;

    // Keep only last 1000 events
    if (this.userProfile.listeningHistory.length > 1000) {
      this.userProfile.listeningHistory = this.userProfile.listeningHistory.slice(-1000);
    }
  }

  /**
   * Mark a track as liked
   */
  likeTrack(trackId: string): void {
    if (!this.userProfile.likedTracks.includes(trackId)) {
      this.userProfile.likedTracks.push(trackId);
    }
    // Remove from disliked if present
    this.userProfile.dislikedTracks = this.userProfile.dislikedTracks.filter(
      id => id !== trackId
    );
  }

  /**
   * Mark a track as disliked
   */
  dislikeTrack(trackId: string): void {
    if (!this.userProfile.dislikedTracks.includes(trackId)) {
      this.userProfile.dislikedTracks.push(trackId);
    }
    // Remove from liked if present
    this.userProfile.likedTracks = this.userProfile.likedTracks.filter(
      id => id !== trackId
    );
  }

  /**
   * Get personalized recommendations
   */
  getRecommendations(
    count: number = 10,
    excludeIds: string[] = []
  ): Track[] {
    const scores = this.calculateRecommendationScores(excludeIds);
    
    // Sort by score and return top N
    const topScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, count);

    return topScores
      .map(s => this.trackDatabase.get(s.trackId))
      .filter((t): t is Track => t !== undefined);
  }

  /**
   * Calculate recommendation scores for all tracks
   */
  private calculateRecommendationScores(excludeIds: string[]): RecommendationScore[] {
    const scores: RecommendationScore[] = [];

    for (const [trackId, track] of this.trackDatabase) {
      // Skip excluded tracks
      if (excludeIds.includes(trackId)) continue;
      
      // Skip disliked tracks
      if (this.userProfile.dislikedTracks.includes(trackId)) continue;

      const score = this.calculateTrackScore(track);
      scores.push(score);
    }

    return scores;
  }

  /**
   * Calculate score for a single track
   */
  private calculateTrackScore(track: Track): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];

    // 1. Genre preference (weight: 30%)
    const genreScore = this.calculateGenreScore(track);
    score += genreScore * 0.3;
    if (genreScore > 0.5) {
      reasons.push(`Matches your favorite genre: ${track.genre}`);
    }

    // 2. Artist preference (weight: 25%)
    const artistScore = this.calculateArtistScore(track);
    score += artistScore * 0.25;
    if (artistScore > 0.5) {
      reasons.push(`From artist you like: ${track.artist}`);
    }

    // 3. Similarity to liked tracks (weight: 20%)
    const similarityScore = this.calculateSimilarityScore(track);
    score += similarityScore * 0.2;
    if (similarityScore > 0.5) {
      reasons.push('Similar to songs you liked');
    }

    // 4. Popularity (weight: 10%)
    const popularityScore = (track.popularity || 50) / 100;
    score += popularityScore * 0.1;

    // 5. Freshness - prefer tracks not recently played (weight: 10%)
    const freshnessScore = this.calculateFreshnessScore(track);
    score += freshnessScore * 0.1;

    // 6. Time-based preference (weight: 5%)
    const timeScore = this.calculateTimeScore(track);
    score += timeScore * 0.05;

    // Boost for explicitly liked tracks
    if (this.userProfile.likedTracks.includes(track.id)) {
      score *= 1.5;
      reasons.push('You liked this track');
    }

    return {
      trackId: track.id,
      score: Math.min(score, 1), // Normalize to 0-1
      reasons,
    };
  }

  /**
   * Calculate genre preference score
   */
  private calculateGenreScore(track: Track): number {
    if (!track.genre) return 0;
    const genreCount = this.userProfile.favoriteGenres.get(track.genre) || 0;
    const maxGenreCount = Math.max(...Array.from(this.userProfile.favoriteGenres.values()), 1);
    return genreCount / maxGenreCount;
  }

  /**
   * Calculate artist preference score
   */
  private calculateArtistScore(track: Track): number {
    if (!track.artistId) return 0;
    const artistCount = this.userProfile.favoriteArtists.get(track.artistId) || 0;
    const maxArtistCount = Math.max(...Array.from(this.userProfile.favoriteArtists.values()), 1);
    return artistCount / maxArtistCount;
  }

  /**
   * Calculate similarity to liked tracks
   */
  private calculateSimilarityScore(track: Track): number {
    if (this.userProfile.likedTracks.length === 0) return 0.5;

    let totalSimilarity = 0;
    let count = 0;

    for (const likedTrackId of this.userProfile.likedTracks.slice(-20)) {
      const likedTrack = this.trackDatabase.get(likedTrackId);
      if (likedTrack) {
        const similarity = this.calculateTrackSimilarity(track, likedTrack);
        totalSimilarity += similarity;
        count++;
      }
    }

    return count > 0 ? totalSimilarity / count : 0.5;
  }

  /**
   * Calculate similarity between two tracks
   */
  private calculateTrackSimilarity(track1: Track, track2: Track): number {
    // Check cache first
    if (this.similarityCache.has(track1.id)) {
      const cached = this.similarityCache.get(track1.id)?.get(track2.id);
      if (cached !== undefined) return cached;
    }

    let similarity = 0;

    // Same genre (40%)
    if (track1.genre === track2.genre) {
      similarity += 0.4;
    }

    // Same artist (30%)
    if (track1.artistId === track2.artistId) {
      similarity += 0.3;
    }

    // Similar tempo (15%)
    if (track1.tempo === track2.tempo) {
      similarity += 0.15;
    }

    // Similar mood (15%)
    if (track1.mood === track2.mood) {
      similarity += 0.15;
    }

    // Tag overlap
    if (track1.tags && track2.tags) {
      const commonTags = track1.tags.filter(tag => track2.tags?.includes(tag));
      const tagSimilarity = commonTags.length / Math.max(track1.tags.length, track2.tags.length);
      similarity += tagSimilarity * 0.1;
    }

    // Cache the result
    if (!this.similarityCache.has(track1.id)) {
      this.similarityCache.set(track1.id, new Map());
    }
    this.similarityCache.get(track1.id)?.set(track2.id, similarity);

    return similarity;
  }

  /**
   * Calculate freshness score (prefer tracks not recently played)
   */
  private calculateFreshnessScore(track: Track): number {
    const recentHistory = this.userProfile.listeningHistory.slice(-50);
    const timesPlayed = recentHistory.filter(e => e.trackId === track.id).length;
    
    if (timesPlayed === 0) return 1; // Never played = fresh
    if (timesPlayed > 5) return 0.2; // Played too much recently
    
    return 1 - (timesPlayed / 5);
  }

  /**
   * Calculate time-based preference score
   */
  private calculateTimeScore(_track: Track): number {
    const currentHour = new Date().getHours().toString();
    const hourCount = this.userProfile.listeningTime.get(currentHour) || 0;
    const maxHourCount = Math.max(...Array.from(this.userProfile.listeningTime.values()), 1);
    
    return hourCount / maxHourCount;
  }

  /**
   * Get similar tracks to a given track
   */
  getSimilarTracks(trackId: string, count: number = 10): Track[] {
    const sourceTrack = this.trackDatabase.get(trackId);
    if (!sourceTrack) return [];

    const similarities: Array<{ track: Track; similarity: number }> = [];

    for (const [id, track] of this.trackDatabase) {
      if (id === trackId) continue;
      if (this.userProfile.dislikedTracks.includes(id)) continue;

      const similarity = this.calculateTrackSimilarity(sourceTrack, track);
      similarities.push({ track, similarity });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count)
      .map(s => s.track);
  }

  /**
   * Get tracks by mood
   */
  getTracksByMood(mood: string, count: number = 10): Track[] {
    const tracks = Array.from(this.trackDatabase.values())
      .filter(track => track.mood === mood)
      .filter(track => !this.userProfile.dislikedTracks.includes(track.id));

    // Sort by user preference
    const scored = tracks.map(track => ({
      track,
      score: this.calculateTrackScore(track).score,
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(s => s.track);
  }

  /**
   * Get tracks by genre
   */
  getTracksByGenre(genre: string, count: number = 10): Track[] {
    const tracks = Array.from(this.trackDatabase.values())
      .filter(track => track.genre === genre)
      .filter(track => !this.userProfile.dislikedTracks.includes(track.id));

    // Sort by user preference
    const scored = tracks.map(track => ({
      track,
      score: this.calculateTrackScore(track).score,
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(s => s.track);
  }

  /**
   * Get personalized playlist for current time
   */
  getTimeBasedPlaylist(count: number = 20): Track[] {
    const currentHour = new Date().getHours();
    let mood: string;

    // Morning (6-11): Energetic
    if (currentHour >= 6 && currentHour < 12) {
      mood = 'energetic';
    }
    // Afternoon (12-17): Upbeat
    else if (currentHour >= 12 && currentHour < 18) {
      mood = 'upbeat';
    }
    // Evening (18-22): Relaxed
    else if (currentHour >= 18 && currentHour < 23) {
      mood = 'relaxed';
    }
    // Night (23-5): Calm
    else {
      mood = 'calm';
    }

    return this.getTracksByMood(mood, count);
  }

  /**
   * Get user statistics
   */
  getUserStats() {
    const topGenres = Array.from(this.userProfile.favoriteGenres.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    const topArtists = Array.from(this.userProfile.favoriteArtists.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([artistId, count]) => ({ artistId, count }));

    const totalListeningTime = this.userProfile.listeningHistory.reduce(
      (sum, event) => sum + event.duration,
      0
    );

    return {
      totalTracks: this.userProfile.listeningHistory.length,
      totalListeningTime,
      topGenres,
      topArtists,
      likedTracks: this.userProfile.likedTracks.length,
      skipRate: this.userProfile.skipRate,
    };
  }

  /**
   * Export user profile for persistence
   */
  exportProfile(): string {
    return JSON.stringify({
      userId: this.userProfile.userId,
      listeningHistory: this.userProfile.listeningHistory.slice(-500), // Last 500 events
      likedTracks: this.userProfile.likedTracks,
      dislikedTracks: this.userProfile.dislikedTracks,
      favoriteGenres: Array.from(this.userProfile.favoriteGenres.entries()),
      favoriteArtists: Array.from(this.userProfile.favoriteArtists.entries()),
      listeningTime: Array.from(this.userProfile.listeningTime.entries()),
      skipRate: this.userProfile.skipRate,
    });
  }

  /**
   * Import user profile from storage
   */
  importProfile(profileData: string): void {
    try {
      const data = JSON.parse(profileData);
      this.userProfile = {
        userId: data.userId,
        listeningHistory: data.listeningHistory || [],
        likedTracks: data.likedTracks || [],
        dislikedTracks: data.dislikedTracks || [],
        favoriteGenres: new Map(data.favoriteGenres || []),
        favoriteArtists: new Map(data.favoriteArtists || []),
        listeningTime: new Map(data.listeningTime || []),
        skipRate: data.skipRate || 0,
        averageSessionLength: data.averageSessionLength || 0,
      };
    } catch (error) {
      console.error('Failed to import profile:', error);
    }
  }

  /**
   * Clear user profile
   */
  clearProfile(): void {
    this.userProfile = this.initializeUserProfile();
    this.similarityCache.clear();
  }
}

// Singleton instance
let engineInstance: MusicRecommendationEngine | null = null;

export function getRecommendationEngine(): MusicRecommendationEngine {
  if (!engineInstance) {
    engineInstance = new MusicRecommendationEngine();
  }
  return engineInstance;
}
