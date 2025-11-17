/**
 * Smart Search Algorithm for YouTube Music
 * 
 * Features:
 * - Fuzzy matching for typos
 * - Artist + Song name parsing
 * - Intelligent ranking
 * - Query expansion
 * - Relevance scoring
 */

import { searchYouTube, type YouTubeVideo } from './youtube';

interface SearchOptions {
  maxResults?: number;
  includeRelated?: boolean;
  strictMode?: boolean;
}

interface ScoredResult extends YouTubeVideo {
  relevanceScore: number;
  matchType: 'exact' | 'fuzzy' | 'partial' | 'related';
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score (0-1)
 */
function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

/**
 * Parse search query to extract artist and song
 */
function parseQuery(query: string): { artist?: string; song?: string; full: string } {
  const normalized = query.toLowerCase().trim();
  
  // Common separators
  const separators = [' by ', ' - ', ' | ', ' ft ', ' feat ', ' featuring '];
  
  for (const sep of separators) {
    if (normalized.includes(sep)) {
      const parts = normalized.split(sep);
      return {
        song: parts[0].trim(),
        artist: parts[1].trim(),
        full: normalized,
      };
    }
  }

  return { full: normalized };
}

/**
 * Expand query with common variations
 */
function expandQuery(query: string): string[] {
  const queries = [query];
  const parsed = parseQuery(query);

  // Add variations
  if (parsed.artist && parsed.song) {
    queries.push(`${parsed.song} ${parsed.artist}`);
    queries.push(`${parsed.artist} ${parsed.song}`);
    queries.push(`${parsed.song} official audio`);
    queries.push(`${parsed.song} ${parsed.artist} official`);
    queries.push(`${parsed.song} lyric video`);
  } else {
    queries.push(`${query} official audio`);
    queries.push(`${query} official video`);
    queries.push(`${query} lyrics`);
  }

  return queries;
}

/**
 * Calculate relevance score for a video
 */
function calculateRelevance(video: YouTubeVideo, query: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = video.title.toLowerCase();
  const channelLower = video.channelTitle.toLowerCase();
  
  let score = 0;
  const parsed = parseQuery(query);

  // Exact title match (highest score)
  if (titleLower === queryLower) {
    score += 100;
  }

  // Title contains exact query
  if (titleLower.includes(queryLower)) {
    score += 50;
  }

  // Fuzzy title match
  const titleSimilarity = similarityScore(titleLower, queryLower);
  score += titleSimilarity * 40;

  // Check for artist match
  if (parsed.artist) {
    if (channelLower.includes(parsed.artist)) {
      score += 30;
    }
    if (titleLower.includes(parsed.artist)) {
      score += 20;
    }
  }

  // Check for song match
  if (parsed.song) {
    if (titleLower.includes(parsed.song)) {
      score += 25;
    }
  }

  // Bonus for official content
  if (titleLower.includes('official')) {
    score += 15;
  }

  // Bonus for audio/music video
  if (titleLower.includes('audio') || titleLower.includes('music video')) {
    score += 10;
  }

  // Bonus for verified/official channels
  if (channelLower.includes('vevo') || 
      channelLower.includes('official') || 
      channelLower.includes('records')) {
    score += 10;
  }

  // Penalty for live performances (unless query includes "live")
  if (titleLower.includes('live') && !queryLower.includes('live')) {
    score -= 10;
  }

  // Penalty for covers (unless query includes "cover")
  if (titleLower.includes('cover') && !queryLower.includes('cover')) {
    score -= 15;
  }

  // Penalty for remixes (unless query includes "remix")
  if (titleLower.includes('remix') && !queryLower.includes('remix')) {
    score -= 10;
  }

  // Word-by-word matching
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  const titleWords = titleLower.split(/\s+/);
  const matchedWords = queryWords.filter(qw => 
    titleWords.some(tw => tw.includes(qw) || qw.includes(tw))
  );
  score += (matchedWords.length / queryWords.length) * 20;

  return Math.max(0, score);
}

/**
 * Determine match type
 */
function getMatchType(video: YouTubeVideo, query: string): 'exact' | 'fuzzy' | 'partial' | 'related' {
  const queryLower = query.toLowerCase();
  const titleLower = video.title.toLowerCase();

  if (titleLower === queryLower) return 'exact';
  if (titleLower.includes(queryLower)) return 'partial';
  
  const similarity = similarityScore(titleLower, queryLower);
  if (similarity > 0.7) return 'fuzzy';
  
  return 'related';
}

/**
 * Smart search with intelligent ranking
 */
export async function smartSearch(
  query: string,
  options: SearchOptions = {}
): Promise<ScoredResult[]> {
  const {
    maxResults = 20,
    includeRelated = true,
    strictMode = false,
  } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Get expanded queries
    const queries = includeRelated ? expandQuery(query) : [query];
    
    // Search with multiple queries
    const allResults: YouTubeVideo[] = [];
    const seenIds = new Set<string>();

    for (const q of queries.slice(0, 3)) { // Limit to 3 variations
      try {
        const results = await searchYouTube(q, 10);
        results.forEach(video => {
          if (!seenIds.has(video.videoId)) {
            allResults.push(video);
            seenIds.add(video.videoId);
          }
        });
      } catch (error) {
        console.error(`Search failed for query: ${q}`, error);
      }
    }

    // Score and rank results
    const scoredResults: ScoredResult[] = allResults.map(video => ({
      ...video,
      relevanceScore: calculateRelevance(video, query),
      matchType: getMatchType(video, query),
    }));

    // Sort by relevance score
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Filter in strict mode
    if (strictMode) {
      return scoredResults
        .filter(r => r.relevanceScore > 30)
        .slice(0, maxResults);
    }

    return scoredResults.slice(0, maxResults);
  } catch (error) {
    console.error('Smart search failed:', error);
    return [];
  }
}

/**
 * Search with autocorrect suggestions
 */
export async function searchWithSuggestions(query: string): Promise<{
  results: ScoredResult[];
  suggestions: string[];
  correctedQuery?: string;
}> {
  const results = await smartSearch(query);
  
  // Generate suggestions based on results
  const suggestions: string[] = [];

  // Extract common patterns from top results
  results.slice(0, 5).forEach(result => {
    // Suggest artist names
    const channel = result.channelTitle;
    if (!query.toLowerCase().includes(channel.toLowerCase())) {
      suggestions.push(`${query} ${channel}`);
    }

    // Suggest "official" if not present
    if (!query.includes('official') && result.title.toLowerCase().includes('official')) {
      suggestions.push(`${query} official`);
    }
  });

  // Remove duplicates and limit
  const uniqueSuggestions = [...new Set(suggestions)].slice(0, 5);

  return {
    results,
    suggestions: uniqueSuggestions,
    correctedQuery: results.length > 0 && results[0].relevanceScore > 80 
      ? results[0].title 
      : undefined,
  };
}

/**
 * Quick search for instant results
 */
export async function quickSearch(query: string): Promise<YouTubeVideo[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const results = await searchYouTube(query, 5);
    return results;
  } catch (error) {
    console.error('Quick search failed:', error);
    return [];
  }
}

/**
 * Search by artist
 */
export async function searchByArtist(artist: string, maxResults: number = 20): Promise<ScoredResult[]> {
  const query = `${artist} official audio`;
  return smartSearch(query, { maxResults, strictMode: true });
}

/**
 * Search by song and artist
 */
export async function searchBySongAndArtist(
  song: string,
  artist: string,
  maxResults: number = 10
): Promise<ScoredResult[]> {
  const query = `${song} ${artist}`;
  return smartSearch(query, { maxResults, strictMode: true });
}

/**
 * Get search analytics
 */
export function getSearchAnalytics(results: ScoredResult[]): {
  totalResults: number;
  exactMatches: number;
  fuzzyMatches: number;
  averageScore: number;
  topScore: number;
} {
  return {
    totalResults: results.length,
    exactMatches: results.filter(r => r.matchType === 'exact').length,
    fuzzyMatches: results.filter(r => r.matchType === 'fuzzy').length,
    averageScore: results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length || 0,
    topScore: results[0]?.relevanceScore || 0,
  };
}
