/**
 * Recommendation Ranker
 * 
 * Combines multiple signals to rank candidate tracks.
 * Uses a weighted scoring function to produce final recommendations.
 */

import { computeEmbeddingSimilarity } from './item2vec.js';
import { computeCooccurrenceScore } from './cooccurrence.js';
import { genreMatch, artistMatch, audioFeatureSimilarity, tagSimilarity, popularityScore, getTrack } from './features.js';

export interface Candidate {
  id: string;
  source: string; // Where this candidate came from
}

export interface ScoredCandidate {
  id: string;
  title: string;
  artist: string;
  genre: string;
  score: number;
  breakdown: {
    embedding: number;
    cooccurrence: number;
    genre: number;
    artist: number;
    audioFeatures: number;
    tags: number;
    popularity: number;
  };
}

// Scoring weights (must sum to 1.0)
const WEIGHTS = {
  embedding: 0.35,
  cooccurrence: 0.25,
  genre: 0.10,
  artist: 0.05,
  audioFeatures: 0.10,
  tags: 0.05,
  popularity: 0.10,
};

/**
 * Rank candidates using weighted scoring
 */
export function rankCandidates(
  trackId: string,
  candidates: Candidate[],
  topN: number = 10
): ScoredCandidate[] {
  const scored: ScoredCandidate[] = [];

  for (const candidate of candidates) {
    // Skip if same as input track
    if (candidate.id === trackId) continue;

    // Compute individual scores
    const embeddingScore = computeEmbeddingSimilarity(trackId, candidate.id);
    const cooccurrenceScore = computeCooccurrenceScore(trackId, candidate.id);
    const genreScore = genreMatch(trackId, candidate.id);
    const artistScore = artistMatch(trackId, candidate.id);
    const audioScore = audioFeatureSimilarity(trackId, candidate.id);
    const tagScore = tagSimilarity(trackId, candidate.id);
    const popScore = popularityScore(candidate.id);

    // Weighted final score
    const finalScore =
      WEIGHTS.embedding * embeddingScore +
      WEIGHTS.cooccurrence * cooccurrenceScore +
      WEIGHTS.genre * genreScore +
      WEIGHTS.artist * artistScore +
      WEIGHTS.audioFeatures * audioScore +
      WEIGHTS.tags * tagScore +
      WEIGHTS.popularity * popScore;

    const track = getTrack(candidate.id);
    if (!track) continue;

    scored.push({
      id: candidate.id,
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      score: finalScore,
      breakdown: {
        embedding: embeddingScore,
        cooccurrence: cooccurrenceScore,
        genre: genreScore,
        artist: artistScore,
        audioFeatures: audioScore,
        tags: tagScore,
        popularity: popScore,
      },
    });
  }

  // Sort by score and return top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Get scoring weights (for debugging/tuning)
 */
export function getWeights() {
  return WEIGHTS;
}
