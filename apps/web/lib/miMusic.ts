/**
 * Mi Music Integration
 * Mi Music is Xiaomi's music streaming service
 */

export interface MiMusicSong {
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

export interface MiMusicPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: MiMusicSong[];
  category: string;
}

// Mi Music Categories
export const miMusicCategories = [
  { id: 'popular', name: 'Popular', icon: '⭐' },
  { id: 'bollywood', name: 'Bollywood', icon: '🎬' },
  { id: 'regional', name: 'Regional', icon: '🎵' },
  { id: 'international', name: 'International', icon: '🌍' },
  { id: 'party', name: 'Party', icon: '🎉' },
];

// Sample Mi Music songs (for demo)
export const miMusicSongs: MiMusicSong[] = [
  {
    id: 'mimusic-1',
    title: 'Dil Diyan Gallan',
    artist: 'Atif Aslam',
    album: 'Tiger Zinda Hai',
    duration: 245,
    coverUrl: 'https://via.placeholder.com/300x300?text=Dil+Diyan+Gallan',
    audioUrl: 'mimusic:dil-diyan-gallan',
    language: 'Hindi',
    genre: 'Bollywood',
  },
  {
    id: 'mimusic-2',
    title: 'Hawayein',
    artist: 'Arijit Singh',
    album: 'Jab Harry Met Sejal',
    duration: 228,
    coverUrl: 'https://via.placeholder.com/300x300?text=Hawayein',
    audioUrl: 'mimusic:hawayein',
    language: 'Hindi',
    genre: 'Bollywood',
  },
  {
    id: 'mimusic-3',
    title: 'Bekhayali',
    artist: 'Sachet Tandon',
    album: 'Kabir Singh',
    duration: 342,
    coverUrl: 'https://via.placeholder.com/300x300?text=Bekhayali',
    audioUrl: 'mimusic:bekhayali',
    language: 'Hindi',
    genre: 'Bollywood',
  },
];

// Sample Mi Music playlists
export const miMusicPlaylists: MiMusicPlaylist[] = [
  {
    id: 'mimusic-playlist-1',
    name: 'Bollywood Top 50',
    description: 'Most popular Bollywood songs',
    coverUrl: 'https://via.placeholder.com/300x300?text=Top+50',
    songs: miMusicSongs,
    category: 'bollywood',
  },
];

// Search Mi Music songs
export const searchMiMusicSongs = (query: string): MiMusicSong[] => {
  const lowerQuery = query.toLowerCase();
  return miMusicSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album?.toLowerCase().includes(lowerQuery)
  );
};

// Get songs by category
export const getMiMusicSongsByCategory = (category: string): MiMusicSong[] => {
  if (category === 'all') return miMusicSongs;
  return miMusicSongs.filter((song) => song.genre.toLowerCase() === category.toLowerCase());
};
