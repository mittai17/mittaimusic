/**
 * YouTube API Integration - Fixed with proper types
 */

const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || 'AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc';

interface YouTubeSnippet {
  title: string;
  description?: string;
  channelTitle: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: YouTubeSnippet;
}

interface YouTubeVideoItem {
  id: string;
  snippet: YouTubeSnippet;
  contentDetails?: { duration: string };
}

interface YouTubePlaylistItem {
  contentDetails: { videoId: string };
  snippet: YouTubeSnippet;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

export const extractPlaylistId = (url: string): string | null => {
  const match = url.match(/[?&]list=([^&\n?#]+)/);
  return match ? match[1] : null;
};

const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

export const getVideoInfo = async (videoId: string) => {
  if (!YT_API_KEY) throw new Error('YouTube API key not configured');
  
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YT_API_KEY}&part=snippet,contentDetails`
  );
  
  if (!response.ok) throw new Error(`YouTube API error: ${response.statusText}`);
  
  const data = await response.json();
  if (!data.items || data.items.length === 0) throw new Error('Video not found');
  
  const video: YouTubeVideoItem = data.items[0];
  const duration = video.contentDetails ? parseDuration(video.contentDetails.duration) : 0;
  
  return {
    id: videoId,
    title: video.snippet.title,
    description: video.snippet.description || '',
    thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url || '',
    channelTitle: video.snippet.channelTitle,
    duration,
    audioUrl: `youtube:${videoId}`,
  };
};

export const getPlaylistItems = async (playlistId: string, maxResults: number = 50): Promise<YouTubeVideo[]> => {
  if (!YT_API_KEY) throw new Error('YouTube API key not configured');
  
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${YT_API_KEY}&part=snippet,contentDetails&maxResults=${maxResults}`
  );
  
  if (!response.ok) throw new Error(`YouTube API error: ${response.statusText}`);
  
  const data = await response.json();
  return data.items.map((item: YouTubePlaylistItem) => ({
    videoId: item.contentDetails.videoId,
    title: item.snippet.title,
    description: item.snippet.description || '',
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
    channelTitle: item.snippet.channelTitle,
  }));
};

export const searchYouTube = async (
  query: string,
  maxResults: number = 10,
  videoCategoryId?: string
): Promise<YouTubeVideo[]> => {
  console.log('=== YouTube Search Debug ===');
  console.log('API Key present:', !!YT_API_KEY);
  console.log('API Key length:', YT_API_KEY?.length);
  console.log('Query:', query);
  console.log('Max Results:', maxResults);
  
  if (!YT_API_KEY) {
    console.warn('❌ YouTube API key not configured, using mock data');
    const { searchMockYouTube } = await import('./mockYouTubeData');
    return searchMockYouTube(query, maxResults);
  }
  
  let url = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}&key=${YT_API_KEY}&part=snippet&type=video&maxResults=${maxResults}`;
  if (videoCategoryId) url += `&videoCategoryId=${videoCategoryId}`;
  
  console.log('🔍 Fetching from YouTube API...');
  console.log('URL:', url.replace(YT_API_KEY, 'API_KEY_HIDDEN'));
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('📡 Response Status:', response.status);
    console.log('📦 Response Data:', data);
    
    if (!response.ok) {
      const errorMessage = data.error?.message || response.statusText;
      console.error('❌ YouTube API Error:', errorMessage);
      console.error('Error Details:', data.error);
      
      // Fallback to mock data on API error
      console.warn('⚠️ Falling back to mock data due to API error');
      const { searchMockYouTube } = await import('./mockYouTubeData');
      return searchMockYouTube(query, maxResults);
    }
    
    if (!data.items || data.items.length === 0) {
      console.warn('⚠️ No results found for query:', query);
      // Return mock data instead of empty array
      console.warn('⚠️ Returning mock data instead');
      const { searchMockYouTube } = await import('./mockYouTubeData');
      return searchMockYouTube(query, maxResults);
    }
    
    console.log('✅ Found', data.items.length, 'results from YouTube API');
    
    return data.items.map((item: YouTubeSearchItem) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description || '',
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('❌ YouTube API request failed:', error);
    console.warn('⚠️ Falling back to mock data');
    const { searchMockYouTube } = await import('./mockYouTubeData');
    return searchMockYouTube(query, maxResults);
  }
};

export const searchYouTubeMusic = async (query: string, maxResults: number = 10): Promise<YouTubeVideo[]> => {
  return searchYouTube(query, maxResults, '10');
};

export const getTrendingMusic = async (maxResults: number = 20, regionCode: string = 'IN'): Promise<YouTubeVideo[]> => {
  if (!YT_API_KEY) {
    console.warn('YouTube API key not configured, using mock data');
    const { getTrendingMockMusic } = await import('./mockYouTubeData');
    return getTrendingMockMusic(maxResults);
  }
  
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=10&regionCode=${regionCode}&maxResults=${maxResults}&key=${YT_API_KEY}`;
  console.log('Fetching trending music...');
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Trending API Response:', data);
    
    if (!response.ok) {
      const errorMessage = data.error?.message || response.statusText;
      console.error('YouTube API Error:', errorMessage);
      
      // Fallback to mock data
      console.warn('Falling back to mock data due to API error');
      const { getTrendingMockMusic } = await import('./mockYouTubeData');
      return getTrendingMockMusic(maxResults);
    }
    
    if (!data.items || data.items.length === 0) {
      console.warn('No trending videos found');
      return [];
    }
    
    return data.items.map((item: YouTubeVideoItem) => ({
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description || '',
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('Trending API request failed:', error);
    console.warn('Falling back to mock data');
    const { getTrendingMockMusic } = await import('./mockYouTubeData');
    return getTrendingMockMusic(maxResults);
  }
};

export const getRelatedVideos = async (videoId: string, maxResults: number = 10): Promise<YouTubeVideo[]> => {
  if (!YT_API_KEY) {
    console.warn('YouTube API key not configured, using mock data');
    const { getRelatedMockVideos } = await import('./mockYouTubeData');
    return getRelatedMockVideos(videoId, maxResults);
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?relatedToVideoId=${videoId}&type=video&key=${YT_API_KEY}&part=snippet&maxResults=${maxResults}&videoCategoryId=10`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Related videos API error:', data.error?.message);
      const { getRelatedMockVideos } = await import('./mockYouTubeData');
      return getRelatedMockVideos(videoId, maxResults);
    }
    
    return data.items.map((item: YouTubeSearchItem) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description || '',
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('Related videos request failed:', error);
    const { getRelatedMockVideos } = await import('./mockYouTubeData');
    return getRelatedMockVideos(videoId, maxResults);
  }
};
