/**
 * Co-occurrence Matrix Builder
 * 
 * Builds a matrix of how often tracks appear together in listening sessions.
 * This captures collaborative filtering patterns.
 */

interface Session {
  userId: string;
  sessionId: string;
  tracks: string[];
}

interface CoMatrix {
  [trackId: string]: {
    [coTrackId: string]: number;
  };
}

let coMatrix: CoMatrix = {};

/**
 * Build co-occurrence matrix from user sessions
 * Counts how many times tracks appear together in the same session
 */
export function buildCoMatrix(sessions: Session[]): void {
  coMatrix = {};

  for (const session of sessions) {
    const tracks = session.tracks;

    // For each pair of tracks in the session
    for (let i = 0; i < tracks.length; i++) {
      const trackA = tracks[i];

      if (!coMatrix[trackA]) {
        coMatrix[trackA] = {};
      }

      for (let j = 0; j < tracks.length; j++) {
        if (i === j) continue;

        const trackB = tracks[j];

        // Increment co-occurrence count
        if (!coMatrix[trackA][trackB]) {
          coMatrix[trackA][trackB] = 0;
        }
        coMatrix[trackA][trackB]++;
      }
    }
  }

  console.log(`✓ Co-occurrence matrix built with ${Object.keys(coMatrix).length} tracks`);
}

/**
 * Get tracks that co-occur most frequently with the given track
 */
export function getCoSimilar(trackId: string, topN: number = 10): Array<{ id: string; score: number }> {
  if (!coMatrix[trackId]) {
    return [];
  }

  const coTracks = coMatrix[trackId];
  const sorted = Object.entries(coTracks)
    .map(([id, count]) => ({
      id,
      score: count,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return sorted;
}

/**
 * Compute co-occurrence score between two tracks
 */
export function computeCooccurrenceScore(trackA: string, trackB: string): number {
  if (!coMatrix[trackA] || !coMatrix[trackA][trackB]) {
    return 0;
  }

  // Normalize by the maximum co-occurrence count for trackA
  const maxCount = Math.max(...Object.values(coMatrix[trackA]));
  return coMatrix[trackA][trackB] / maxCount;
}

/**
 * Get the co-occurrence matrix (for debugging)
 */
export function getCoMatrix(): CoMatrix {
  return coMatrix;
}
