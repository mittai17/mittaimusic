/**
 * Automatic Queue Management with Item2Vec
 * 
 * Automatically fills the queue with recommended songs
 * based on listening history and current track
 */

import { getSimilar, computeEmbeddingSimilarity } from './item2vec.js';
import { getTrack } from './features.js';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  coverUrl?: string;
  audioUrl?: string;
}

interface QueueConfig {
  minQueueSize: number;
  maxQueueSize: number;
  similarityThreshold: number;
  diversityFactor: number;
  autoRefill: boolean;
}

const DEFAULT_CONFIG: QueueConfig = {
  minQueueSize: 5,
  maxQueueSize: 20,
  similarityThreshold: 0.3,
  diversityFactor: 0.2,
  autoRefill: true,
};

class AutoQueueManager {
  private queue: Track[] = [];
  private playHistory: string[] = [];
  private config: QueueConfig;
  private recentlyAdded: Set<string> = new Set();

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get current queue
   */
  getQueue(): Track[] {
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Check if queue needs refilling
   */
  needsRefill(): boolean {
    return this.queue.length < this.config.minQueueSize;
  }

  /**
   * Add track to play history
   */
  addToHistory(trackId: string): void {
    this.playHistory.push(trackId);
    
    // Keep only last 50 tracks
    if (this.playHistory.length > 50) {
      this.playHistory = this.playHistory.slice(-50);
    }

    // Remove from recently added
    this.recentlyAdded.delete(trackId);
  }

  /**
   * Get next track from queue
   */
  getNextTrack(): Track | null {
    if (this.queue.length === 0) {
      return null;
    }

    const track = this.queue.shift()!;
    this.addToHistory(track.id);

    // Auto-refill if needed
    if (this.config.autoRefill && this.needsRefill()) {
      this.refillQueue(track.id);
    }

    return track;
  }

  /**
   * Add track to queue
   */
  addToQueue(track: Track): void {
    // Don't add if already in queue or recently played
    if (this.isInQueue(track.id) || this.wasRecentlyPlayed(track.id)) {
      return;
    }

    // Don't exceed max size
    if (this.queue.length >= this.config.maxQueueSize) {
      return;
    }

    this.queue.push(track);
    this.recentlyAdded.add(track.id);
  }

  /**
   * Add multiple tracks to queue
   */
  addMultipleToQueue(tracks: Track[]): void {
    for (const track of tracks) {
      this.addToQueue(track);
      
      if (this.queue.length >= this.config.maxQueueSize) {
        break;
      }
    }
  }

  /**
   * Check if track is in queue
   */
  isInQueue(trackId: string): boolean {
    return this.queue.some(t => t.id === trackId);
  }

  /**
   * Check if track was recently played
   */
  wasRecentlyPlayed(trackId: string): boolean {
    // Check last 10 tracks
    const recentHistory = this.playHistory.slice(-10);
    return recentHistory.includes(trackId);
  }

  /**
   * Get recommended tracks based on current track
   */
  getRecommendations(currentTrackId: string, count: number = 10): Array<{ id: string; score: number }> {
    // Get similar tracks from Item2Vec
    const similar = getSimilar(currentTrackId, count * 2);

    // Filter out tracks already in queue or recently played
    const filtered = similar.filter(item => 
      !this.isInQueue(item.id) && 
      !this.wasRecentlyPlayed(item.id) &&
      item.score >= this.config.similarityThreshold
    );

    // Apply diversity factor
    const diverse = this.applyDiversity(filtered, currentTrackId);

    return diverse.slice(0, count);
  }

  /**
   * Apply diversity to recommendations
   * Ensures variety by reducing similarity between consecutive tracks
   */
  private applyDiversity(
    recommendations: Array<{ id: string; score: number }>,
    currentTrackId: string
  ): Array<{ id: string; score: number }> {
    if (recommendations.length === 0) return [];

    const result: Array<{ id: string; score: number }> = [];
    const remaining = [...recommendations];

    // Add first recommendation
    result.push(remaining.shift()!);

    // Add remaining with diversity
    while (remaining.length > 0 && result.length < recommendations.length) {
      let bestIndex = 0;
      let bestScore = -1;

      // Find track that's different from last added
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        const lastAdded = result[result.length - 1];

        // Calculate diversity score
        const similarity = computeEmbeddingSimilarity(lastAdded.id, candidate.id);
        const diversityScore = candidate.score * (1 - this.config.diversityFactor * similarity);

        if (diversityScore > bestScore) {
          bestScore = diversityScore;
          bestIndex = i;
        }
      }

      result.push(remaining.splice(bestIndex, 1)[0]);
    }

    return result;
  }

  /**
   * Refill queue with recommendations
   */
  async refillQueue(currentTrackId: string): Promise<void> {
    const needed = this.config.maxQueueSize - this.queue.length;
    
    if (needed <= 0) {
      return;
    }

    console.log(`🔄 Refilling queue (need ${needed} tracks)...`);

    // Get recommendations
    const recommendations = this.getRecommendations(currentTrackId, needed);

    // Fetch track details
    const tracks: Track[] = [];
    for (const rec of recommendations) {
      const track = getTrack(rec.id);
      if (track) {
        tracks.push({
          id: track.id,
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          duration: track.duration || 180,
          coverUrl: (track as any).coverUrl,
          audioUrl: (track as any).audioUrl,
        });
      }
    }

    // Add to queue
    this.addMultipleToQueue(tracks);

    console.log(`✓ Added ${tracks.length} tracks to queue (total: ${this.queue.length})`);
  }

  /**
   * Initialize queue with seed track
   */
  async initializeQueue(seedTrackId: string): Promise<void> {
    console.log(`🎵 Initializing queue with seed track: ${seedTrackId}`);

    // Clear existing queue
    this.queue = [];
    this.recentlyAdded.clear();

    // Add seed track to history
    this.addToHistory(seedTrackId);

    // Fill queue
    await this.refillQueue(seedTrackId);
  }

  /**
   * Get smart recommendations based on listening history
   */
  getSmartRecommendations(count: number = 10): Array<{ id: string; score: number }> {
    if (this.playHistory.length === 0) {
      return [];
    }

    // Get recent tracks (last 5)
    const recentTracks = this.playHistory.slice(-5);

    // Get recommendations for each recent track
    const allRecommendations = new Map<string, number>();

    for (const trackId of recentTracks) {
      const recs = getSimilar(trackId, 20);
      
      for (const rec of recs) {
        // Skip if already in queue or recently played
        if (this.isInQueue(rec.id) || this.wasRecentlyPlayed(rec.id)) {
          continue;
        }

        // Aggregate scores
        const currentScore = allRecommendations.get(rec.id) || 0;
        allRecommendations.set(rec.id, currentScore + rec.score);
      }
    }

    // Sort by aggregated score
    const sorted = Array.from(allRecommendations.entries())
      .map(([id, score]) => ({ id, score: score / recentTracks.length }))
      .sort((a, b) => b.score - a.score);

    return sorted.slice(0, count);
  }

  /**
   * Refill queue with smart recommendations
   */
  async smartRefill(): Promise<void> {
    const needed = this.config.maxQueueSize - this.queue.length;
    
    if (needed <= 0) {
      return;
    }

    console.log(`🧠 Smart refilling queue (need ${needed} tracks)...`);

    // Get smart recommendations
    const recommendations = this.getSmartRecommendations(needed);

    // Fetch track details
    const tracks: Track[] = [];
    for (const rec of recommendations) {
      const track = getTrack(rec.id);
      if (track) {
        tracks.push({
          id: track.id,
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          duration: track.duration || 180,
          coverUrl: (track as any).coverUrl,
          audioUrl: (track as any).audioUrl,
        });
      }
    }

    // Add to queue
    this.addMultipleToQueue(tracks);

    console.log(`✓ Added ${tracks.length} tracks to queue (total: ${this.queue.length})`);
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.queue = [];
    this.recentlyAdded.clear();
    console.log('✓ Queue cleared');
  }

  /**
   * Remove track from queue
   */
  removeFromQueue(trackId: string): boolean {
    const index = this.queue.findIndex(t => t.id === trackId);
    
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.recentlyAdded.delete(trackId);
      return true;
    }

    return false;
  }

  /**
   * Reorder queue
   */
  reorderQueue(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= this.queue.length ||
        toIndex < 0 || toIndex >= this.queue.length) {
      return;
    }

    const [track] = this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, track);
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    queueSize: number;
    historySize: number;
    needsRefill: boolean;
    averageSimilarity: number;
  } {
    let totalSimilarity = 0;
    let comparisons = 0;

    // Calculate average similarity between consecutive tracks
    for (let i = 0; i < this.queue.length - 1; i++) {
      const similarity = computeEmbeddingSimilarity(
        this.queue[i].id,
        this.queue[i + 1].id
      );
      totalSimilarity += similarity;
      comparisons++;
    }

    return {
      queueSize: this.queue.length,
      historySize: this.playHistory.length,
      needsRefill: this.needsRefill(),
      averageSimilarity: comparisons > 0 ? totalSimilarity / comparisons : 0,
    };
  }

  /**
   * Export queue state
   */
  exportState(): {
    queue: Track[];
    history: string[];
    config: QueueConfig;
  } {
    return {
      queue: [...this.queue],
      history: [...this.playHistory],
      config: { ...this.config },
    };
  }

  /**
   * Import queue state
   */
  importState(state: {
    queue: Track[];
    history: string[];
    config?: Partial<QueueConfig>;
  }): void {
    this.queue = [...state.queue];
    this.playHistory = [...state.history];
    
    if (state.config) {
      this.config = { ...this.config, ...state.config };
    }

    console.log('✓ Queue state imported');
  }
}

// Singleton instance
let autoQueueInstance: AutoQueueManager | null = null;

/**
 * Get or create AutoQueue instance
 */
export function getAutoQueue(config?: Partial<QueueConfig>): AutoQueueManager {
  if (!autoQueueInstance) {
    autoQueueInstance = new AutoQueueManager(config);
  }
  return autoQueueInstance;
}

/**
 * Reset AutoQueue instance
 */
export function resetAutoQueue(): void {
  autoQueueInstance = null;
}

// Export class for custom instances
export { AutoQueueManager };
export type { Track, QueueConfig };
