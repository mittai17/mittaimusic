/**
 * Tamil Music API Integration
 * Helper functions to fetch and stream Tamil music from open sources
 */

export interface MusicSource {
  name: string;
  baseUrl: string;
  apiKey?: string;
  requiresAuth: boolean;
}

// Open Source Music APIs
export const musicSources: Record<string, MusicSource> = {
  internetArchive: {
    name: 'Internet Archive',
    baseUrl: 'https://archive.org',
    requiresAuth: false,
  },
  wikimedia: {
    name: 'Wikimedia Commons',
    baseUrl: 'https://commons.wikimedia.org',
    requiresAuth: false,
  },
  freeMusicArchive: {
    name: 'Free Music Archive',
    baseUrl: 'https://freemusicarchive.org',
    requiresAuth: false,
  },
};

/**
 * Fetch Tamil music from Internet Archive
 * @param query Search query (e.g., "Tamil classical", "Carnatic")
 * @param limit Number of results
 */
export async function searchInternetArchive(query: string, limit: number = 20) {
  try {
    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,date,format&rows=${limit}&output=json`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return data.response.docs.map((item: any) => ({
      id: item.identifier,
      title: item.title,
      artist: item.creator || 'Unknown',
      year: item.date ? parseInt(item.date) : undefined,
      source: 'Internet Archive',
      url: `https://archive.org/details/${item.identifier}`,
    }));
  } catch (error) {
    console.error('Error fetching from Internet Archive:', error);
    return [];
  }
}

/**
 * Get direct audio URL from Internet Archive
 * @param identifier Archive.org identifier
 */
export async function getInternetArchiveAudio(identifier: string) {
  try {
    const metadataUrl = `https://archive.org/metadata/${identifier}`;
    const response = await fetch(metadataUrl);
    const data = await response.json();
    
    // Find audio files (mp3, ogg, flac)
    const audioFiles = data.files?.filter((file: any) => 
      ['mp3', 'ogg', 'flac'].includes(file.format?.toLowerCase())
    );
    
    if (audioFiles && audioFiles.length > 0) {
      const audioFile = audioFiles[0];
      return `https://archive.org/download/${identifier}/${audioFile.name}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    return null;
  }
}

/**
 * Search Wikimedia Commons for Tamil music
 * @param query Search query
 */
export async function searchWikimediaCommons(query: string) {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&origin=*`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return data.query?.search || [];
  } catch (error) {
    console.error('Error fetching from Wikimedia:', error);
    return [];
  }
}

/**
 * Validate audio URL is accessible
 * @param url Audio URL to validate
 */
export async function validateAudioUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating audio URL:', error);
    return false;
  }
}

/**
 * Get audio metadata (duration, bitrate, etc.)
 * @param url Audio URL
 */
export async function getAudioMetadata(url: string) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        duration: audio.duration,
        src: audio.src,
      });
    });
    
    audio.addEventListener('error', (error) => {
      reject(error);
    });
    
    audio.src = url;
  });
}

/**
 * Fetch Tamil music collections from Internet Archive
 */
export async function getTamilCollections() {
  const collections = [
    'carnatic-music-collection',
    'tamil-folk-music',
    'devotional-tamil',
    'tamil-classical-instrumental',
  ];
  
  const results = await Promise.all(
    collections.map(async (collection) => {
      try {
        const url = `https://archive.org/metadata/${collection}`;
        const response = await fetch(url);
        const data = await response.json();
        return {
          id: collection,
          title: data.metadata?.title || collection,
          description: data.metadata?.description || '',
          files: data.files?.filter((f: any) => 
            ['mp3', 'ogg'].includes(f.format?.toLowerCase())
          ) || [],
        };
      } catch (error) {
        console.error(`Error fetching collection ${collection}:`, error);
        return null;
      }
    })
  );
  
  return results.filter(Boolean);
}

/**
 * Stream audio with progress tracking
 * @param url Audio URL
 * @param onProgress Progress callback
 */
export async function streamAudio(
  url: string,
  onProgress?: (loaded: number, total: number) => void
) {
  try {
    const response = await fetch(url);
    const reader = response.body?.getReader();
    const contentLength = parseInt(response.headers.get('Content-Length') || '0');
    
    if (!reader) {
      throw new Error('Failed to get reader');
    }
    
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (onProgress) {
        onProgress(receivedLength, contentLength);
      }
    }
    
    // Combine chunks into single array
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    
    return chunksAll;
  } catch (error) {
    console.error('Error streaming audio:', error);
    throw error;
  }
}

/**
 * Cache audio file locally (for offline playback)
 * @param url Audio URL
 * @param cacheKey Cache identifier
 */
export async function cacheAudio(url: string, cacheKey: string) {
  if ('caches' in window) {
    try {
      const cache = await caches.open('tamil-music-cache');
      const response = await fetch(url);
      await cache.put(cacheKey, response);
      return true;
    } catch (error) {
      console.error('Error caching audio:', error);
      return false;
    }
  }
  return false;
}

/**
 * Get cached audio
 * @param cacheKey Cache identifier
 */
export async function getCachedAudio(cacheKey: string) {
  if ('caches' in window) {
    try {
      const cache = await caches.open('tamil-music-cache');
      const response = await cache.match(cacheKey);
      return response;
    } catch (error) {
      console.error('Error getting cached audio:', error);
      return null;
    }
  }
  return null;
}

/**
 * Clear audio cache
 */
export async function clearAudioCache() {
  if ('caches' in window) {
    try {
      await caches.delete('tamil-music-cache');
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
  return false;
}

// Export all functions
export default {
  searchInternetArchive,
  getInternetArchiveAudio,
  searchWikimediaCommons,
  validateAudioUrl,
  getAudioMetadata,
  getTamilCollections,
  streamAudio,
  cacheAudio,
  getCachedAudio,
  clearAudioCache,
};
