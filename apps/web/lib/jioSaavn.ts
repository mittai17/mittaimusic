/**
 * JioSaavn Integration
 * JioSaavn is one of India's largest music streaming services
 */

export interface JioSaavnSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  language: string;
  genre: string;
  year?: number;
}

export interface JioSaavnPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: JioSaavnSong[];
  category: string;
}

// JioSaavn Categories
export const jioSaavnCategories = [
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'bollywood', name: 'Bollywood', icon: '🎬' },
  { id: 'punjabi', name: 'Punjabi', icon: '🎵' },
  { id: 'tamil', name: 'Tamil', icon: '🎼' },
  { id: 'telugu', name: 'Telugu', icon: '🎹' },
  { id: 'indie', name: 'Indie', icon: '🎸' },
];

// Sample JioSaavn songs (for demo)
export const jioSaavnSongs: JioSaavnSong[] = [
  {
    id: 'jiosaavn-1',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    album: 'Aashiqui 2',
    duration: 262,
    coverUrl: 'https://via.placeholder.com/300x300?text=Tum+Hi+Ho',
    audioUrl: 'jiosaavn:tum-hi-ho',
    language: 'Hindi',
    genre: 'Bollywood',
    year: 2013,
  },
  {
    id: 'jiosaavn-2',
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    duration: 298,
    coverUrl: 'https://via.placeholder.com/300x300?text=Channa+Mereya',
    audioUrl: 'jiosaavn:channa-mereya',
    language: 'Hindi',
    genre: 'Bollywood',
    year: 2016,
  },
  {
    id: 'jiosaavn-3',
    title: 'Tera Ban Jaunga',
    artist: 'Akhil Sachdeva, Tulsi Kumar',
    album: 'Kabir Singh',
    duration: 234,
    coverUrl: 'https://via.placeholder.com/300x300?text=Tera+Ban+Jaunga',
    audioUrl: 'jiosaavn:tera-ban-jaunga',
    language: 'Hindi',
    genre: 'Bollywood',
    year: 2019,
  },
];

// Sample JioSaavn playlists
export const jioSaavnPlaylists: JioSaavnPlaylist[] = [
  {
    id: 'jiosaavn-playlist-1',
    name: 'Romantic Hits',
    description: 'Best romantic songs from Bollywood',
    coverUrl: 'https://via.placeholder.com/300x300?text=Romantic+Hits',
    songs: jioSaavnSongs,
    category: 'bollywood',
  },
];

// Search JioSaavn songs
export const searchJioSaavnSongs = (query: string): JioSaavnSong[] => {
  const lowerQuery = query.toLowerCase();
  return jioSaavnSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album?.toLowerCase().includes(lowerQuery)
  );
};

// Get songs by category
export const getJioSaavnSongsByCategory = (category: string): JioSaavnSong[] => {
  if (category === 'all') return jioSaavnSongs;
  return jioSaavnSongs.filter((song) => song.genre.toLowerCase() === category.toLowerCase());
};
