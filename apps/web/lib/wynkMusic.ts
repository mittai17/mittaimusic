/**
 * Wynk Music Integration
 * Wynk Music is Airtel's music streaming service popular in India
 */

export interface WynkSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  language: string;
  genre: string;
}

export interface WynkPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: WynkSong[];
  category: string;
}

// Wynk Music Categories
export const wynkCategories = [
  { id: 'bollywood', name: 'Bollywood', icon: '🎬' },
  { id: 'regional', name: 'Regional', icon: '🎵' },
  { id: 'international', name: 'International', icon: '🌍' },
  { id: 'devotional', name: 'Devotional', icon: '🙏' },
  { id: 'indie', name: 'Indie', icon: '🎸' },
];

// Sample Wynk Music songs (for demo)
export const wynkSongs: WynkSong[] = [
  {
    id: 'wynk-1',
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    duration: 268,
    coverUrl: 'https://via.placeholder.com/300x300?text=Kesariya',
    audioUrl: 'wynk:kesariya',
    language: 'Hindi',
    genre: 'Bollywood',
  },
  {
    id: 'wynk-2',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh',
    album: 'Bhediya',
    duration: 245,
    coverUrl: 'https://via.placeholder.com/300x300?text=Apna+Bana+Le',
    audioUrl: 'wynk:apna-bana-le',
    language: 'Hindi',
    genre: 'Bollywood',
  },
  {
    id: 'wynk-3',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur',
    album: 'Shershaah',
    duration: 240,
    coverUrl: 'https://via.placeholder.com/300x300?text=Raataan+Lambiyan',
    audioUrl: 'wynk:raataan-lambiyan',
    language: 'Hindi',
    genre: 'Bollywood',
  },
];

// Sample Wynk playlists
export const wynkPlaylists: WynkPlaylist[] = [
  {
    id: 'wynk-playlist-1',
    name: 'Bollywood Hits 2024',
    description: 'Latest Bollywood chartbusters',
    coverUrl: 'https://via.placeholder.com/300x300?text=Bollywood+Hits',
    songs: wynkSongs,
    category: 'bollywood',
  },
];

// Search Wynk songs
export const searchWynkSongs = (query: string): WynkSong[] => {
  const lowerQuery = query.toLowerCase();
  return wynkSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album?.toLowerCase().includes(lowerQuery)
  );
};

// Get songs by category
export const getWynkSongsByCategory = (category: string): WynkSong[] => {
  if (category === 'all') return wynkSongs;
  return wynkSongs.filter((song) => song.genre.toLowerCase() === category.toLowerCase());
};
