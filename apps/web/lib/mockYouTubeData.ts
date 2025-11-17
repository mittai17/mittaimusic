/**
 * Mock YouTube Data - Fallback when API is unavailable
 */

export interface MockYouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

const mockVideos: MockYouTubeVideo[] = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    description: 'The official video for "Never Gonna Give You Up" by Rick Astley',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    channelTitle: 'Rick Astley'
  },
  {
    videoId: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
    description: 'PSY - GANGNAM STYLE Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg',
    channelTitle: 'officialpsy'
  },
  {
    videoId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    description: 'Despacito Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    channelTitle: 'Luis Fonsi'
  },
  {
    videoId: 'OPf0YbXqDm0',
    title: 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars',
    description: 'Uptown Funk Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
    channelTitle: 'Mark Ronson'
  },
  {
    videoId: 'fRh_vgS2dFE',
    title: 'Justin Bieber - Sorry (Official Music Video)',
    description: 'Sorry Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/fRh_vgS2dFE/hqdefault.jpg',
    channelTitle: 'Justin Bieber'
  },
  {
    videoId: 'RgKAFK5djSk',
    title: 'Wiz Khalifa - See You Again ft. Charlie Puth [Official Video]',
    description: 'See You Again Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg',
    channelTitle: 'Wiz Khalifa'
  },
  {
    videoId: 'CevxZvSJLk8',
    title: 'Katy Perry - Roar (Official)',
    description: 'Roar Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/CevxZvSJLk8/hqdefault.jpg',
    channelTitle: 'Katy Perry'
  },
  {
    videoId: 'JGwWNGJdvx8',
    title: 'Ed Sheeran - Shape of You [Official Video]',
    description: 'Shape of You Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    channelTitle: 'Ed Sheeran'
  },
  {
    videoId: 'lDK9QqIzhwk',
    title: 'Passenger | Let Her Go (Official Video)',
    description: 'Let Her Go Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/lDK9QqIzhwk/hqdefault.jpg',
    channelTitle: 'Passenger'
  },
  {
    videoId: 'hLQl3WQQoQ0',
    title: 'Adele - Someone Like You (Official Music Video)',
    description: 'Someone Like You Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg',
    channelTitle: 'Adele'
  }
];

export const searchMockYouTube = (query: string, maxResults: number = 10): MockYouTubeVideo[] => {
  const lowerQuery = query.toLowerCase();
  
  // Filter videos that match the query
  const filtered = mockVideos.filter(video => 
    video.title.toLowerCase().includes(lowerQuery) ||
    video.channelTitle.toLowerCase().includes(lowerQuery) ||
    video.description.toLowerCase().includes(lowerQuery)
  );
  
  // If no matches, return all videos
  const results = filtered.length > 0 ? filtered : mockVideos;
  
  return results.slice(0, maxResults);
};

export const getTrendingMockMusic = (maxResults: number = 20): MockYouTubeVideo[] => {
  return mockVideos.slice(0, maxResults);
};

export const getRelatedMockVideos = (videoId: string, maxResults: number = 10): MockYouTubeVideo[] => {
  // Return random videos excluding the current one
  return mockVideos
    .filter(v => v.videoId !== videoId)
    .slice(0, maxResults);
};
