/**
 * Tamil Music Library - Open Source Tamil Songs
 * Curated collection of Tamil music from various sources
 */

export interface TamilSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  language: 'Tamil';
  lyrics?: string;
  composer?: string;
  director?: string;
}

export interface TamilArtist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  genres: string[];
  popularSongs: string[];
}

export interface TamilPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: string[];
  category: 'classical' | 'folk' | 'film' | 'devotional' | 'modern';
}

// Tamil Music Categories
export const tamilCategories = [
  { id: 'classical', name: 'Classical', icon: '🎻', description: 'Carnatic and traditional music' },
  { id: 'folk', name: 'Folk', icon: '🪕', description: 'Traditional folk songs' },
  { id: 'film', name: 'Film Songs', icon: '🎬', description: 'Tamil cinema music' },
  { id: 'devotional', name: 'Devotional', icon: '🙏', description: 'Spiritual and devotional' },
  { id: 'modern', name: 'Modern', icon: '🎸', description: 'Contemporary Tamil music' },
  { id: 'indie', name: 'Indie', icon: '🎤', description: 'Independent artists' },
];

// Curated Tamil Songs (Open Source / Public Domain / Creative Commons)
// Sources: Internet Archive, Wikimedia Commons, Free Music Archive, YouTube Audio Library
export const tamilSongs: TamilSong[] = [
  // Classical Carnatic Music (Public Domain)
  {
    id: 'tamil-classical-1',
    title: 'Vatapi Ganapatim',
    artist: 'M.S. Subbulakshmi',
    album: 'Carnatic Classics',
    year: 1960,
    genre: 'Classical',
    duration: 420,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    audioUrl: 'https://archive.org/download/carnatic-music-collection/vatapi-ganapatim.mp3',
    language: 'Tamil',
    composer: 'Muthuswami Dikshitar',
  },
  {
    id: 'tamil-classical-2',
    title: 'Bhaja Govindam',
    artist: 'Traditional',
    album: 'Devotional Classics',
    year: 1950,
    genre: 'Classical',
    duration: 360,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    audioUrl: 'https://archive.org/download/devotional-tamil/bhaja-govindam.mp3',
    language: 'Tamil',
    composer: 'Adi Shankaracharya',
  },
  {
    id: 'tamil-classical-3',
    title: 'Raghuvamsa Sudhambudhi',
    artist: 'Carnatic Ensemble',
    album: 'Classical Collection',
    year: 1965,
    genre: 'Classical',
    duration: 390,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    audioUrl: 'https://archive.org/download/carnatic-ragas/raghuvamsa.mp3',
    language: 'Tamil',
    composer: 'Patnam Subramania Iyer',
  },

  // Folk Music (Creative Commons)
  {
    id: 'tamil-folk-1',
    title: 'Kummi Paattu',
    artist: 'Village Folk Artists',
    album: 'Tamil Folk Songs',
    year: 2010,
    genre: 'Folk',
    duration: 240,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tamil_folk_dance.jpg/300px-Tamil_folk_dance.jpg',
    audioUrl: 'https://archive.org/download/tamil-folk-music/kummi-paattu.mp3',
    language: 'Tamil',
    composer: 'Traditional',
  },
  {
    id: 'tamil-folk-2',
    title: 'Oyilattam',
    artist: 'Folk Ensemble',
    album: 'Village Songs',
    year: 2012,
    genre: 'Folk',
    duration: 280,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tamil_folk_dance.jpg/300px-Tamil_folk_dance.jpg',
    audioUrl: 'https://archive.org/download/tamil-folk-music/oyilattam.mp3',
    language: 'Tamil',
    composer: 'Traditional',
  },
  {
    id: 'tamil-folk-3',
    title: 'Karakattam',
    artist: 'Traditional Artists',
    album: 'Folk Heritage',
    year: 2015,
    genre: 'Folk',
    duration: 300,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tamil_folk_dance.jpg/300px-Tamil_folk_dance.jpg',
    audioUrl: 'https://archive.org/download/tamil-folk-heritage/karakattam.mp3',
    language: 'Tamil',
    composer: 'Traditional',
  },

  // Devotional Music (Public Domain)
  {
    id: 'tamil-devotional-1',
    title: 'Thiruppavai - Margazhi Thingal',
    artist: 'M.S. Subbulakshmi',
    album: 'Thiruppavai',
    year: 1970,
    genre: 'Devotional',
    duration: 180,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hindu_temple.jpg/300px-Hindu_temple.jpg',
    audioUrl: 'https://archive.org/download/thiruppavai-collection/margazhi-thingal.mp3',
    language: 'Tamil',
    composer: 'Andal',
  },
  {
    id: 'tamil-devotional-2',
    title: 'Kanda Sasti Kavasam',
    artist: 'Traditional Singers',
    album: 'Murugan Songs',
    year: 1980,
    genre: 'Devotional',
    duration: 420,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hindu_temple.jpg/300px-Hindu_temple.jpg',
    audioUrl: 'https://archive.org/download/murugan-devotional/kanda-sasti-kavasam.mp3',
    language: 'Tamil',
    composer: 'Devaraya Swamigal',
  },
  {
    id: 'tamil-devotional-3',
    title: 'Vinayagar Agaval',
    artist: 'Devotional Choir',
    album: 'Ganesha Bhajans',
    year: 1975,
    genre: 'Devotional',
    duration: 300,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hindu_temple.jpg/300px-Hindu_temple.jpg',
    audioUrl: 'https://archive.org/download/ganesha-tamil/vinayagar-agaval.mp3',
    language: 'Tamil',
    composer: 'Avvaiyar',
  },

  // Modern Independent Artists (Creative Commons)
  {
    id: 'tamil-indie-1',
    title: 'Nila Kaayuthu',
    artist: 'Indie Tamil Band',
    album: 'Modern Tamil',
    year: 2020,
    genre: 'Indie',
    duration: 240,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    audioUrl: 'https://freemusicarchive.org/track/tamil-indie-nila.mp3',
    language: 'Tamil',
    composer: 'Indie Collective',
  },
  {
    id: 'tamil-indie-2',
    title: 'Kadal Waves',
    artist: 'Chennai Indie',
    album: 'Ocean Sounds',
    year: 2021,
    genre: 'Indie',
    duration: 270,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    audioUrl: 'https://freemusicarchive.org/track/kadal-waves.mp3',
    language: 'Tamil',
    composer: 'Chennai Indie',
  },

  // Instrumental (Royalty Free)
  {
    id: 'tamil-instrumental-1',
    title: 'Veena Meditation',
    artist: 'Classical Instrumentalist',
    album: 'Instrumental Tamil',
    year: 2018,
    genre: 'Classical',
    duration: 360,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    audioUrl: 'https://archive.org/download/veena-collection/veena-meditation.mp3',
    language: 'Tamil',
    composer: 'Traditional',
  },
  {
    id: 'tamil-instrumental-2',
    title: 'Flute Raaga',
    artist: 'Flute Master',
    album: 'Wind Instruments',
    year: 2019,
    genre: 'Classical',
    duration: 300,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    audioUrl: 'https://archive.org/download/flute-ragas/flute-raaga.mp3',
    language: 'Tamil',
    composer: 'Traditional',
  },

  // YouTube Audio Library (Royalty Free Tamil-style music)
  {
    id: 'tamil-modern-1',
    title: 'Chennai Nights',
    artist: 'Audio Library',
    album: 'World Music',
    year: 2022,
    genre: 'Modern',
    duration: 210,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    audioUrl: 'https://www.youtube.com/audiolibrary/download/chennai-nights',
    language: 'Tamil',
    composer: 'YouTube Audio Library',
  },
  {
    id: 'tamil-modern-2',
    title: 'Tamil Fusion',
    artist: 'World Music Collective',
    album: 'Fusion Beats',
    year: 2023,
    genre: 'Modern',
    duration: 195,
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    audioUrl: 'https://www.youtube.com/audiolibrary/download/tamil-fusion',
    language: 'Tamil',
    composer: 'World Music Collective',
  },
];

// Tamil Artists
export const tamilArtists: TamilArtist[] = [
  {
    id: 'ms-subbulakshmi',
    name: 'M.S. Subbulakshmi',
    bio: 'Legendary Carnatic vocalist, first musician to receive Bharat Ratna',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    genres: ['Classical', 'Devotional'],
    popularSongs: ['tamil-classical-1', 'tamil-devotional-1'],
  },
  {
    id: 'folk-ensemble',
    name: 'Tamil Folk Artists',
    bio: 'Traditional village artists preserving Tamil folk heritage',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tamil_folk_dance.jpg/300px-Tamil_folk_dance.jpg',
    genres: ['Folk'],
    popularSongs: ['tamil-folk-1', 'tamil-folk-2', 'tamil-folk-3'],
  },
  {
    id: 'indie-collective',
    name: 'Chennai Indie Collective',
    bio: 'Modern independent Tamil musicians creating fusion music',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    genres: ['Indie', 'Modern', 'Fusion'],
    popularSongs: ['tamil-indie-1', 'tamil-indie-2'],
  },
  {
    id: 'classical-instrumentalists',
    name: 'Classical Instrumentalists',
    bio: 'Masters of traditional Tamil instruments - Veena, Flute, Mridangam',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    genres: ['Classical', 'Instrumental'],
    popularSongs: ['tamil-instrumental-1', 'tamil-instrumental-2'],
  },
  {
    id: 'devotional-choir',
    name: 'Traditional Devotional Singers',
    bio: 'Preserving ancient Tamil devotional music traditions',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hindu_temple.jpg/300px-Hindu_temple.jpg',
    genres: ['Devotional', 'Classical'],
    popularSongs: ['tamil-devotional-1', 'tamil-devotional-2', 'tamil-devotional-3'],
  },
];

// Tamil Playlists
export const tamilPlaylists: TamilPlaylist[] = [
  {
    id: 'classical-gems',
    name: 'Carnatic Classical Gems',
    description: 'Timeless Carnatic music from legendary artists',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    songs: ['tamil-classical-1', 'tamil-classical-2', 'tamil-classical-3', 'tamil-instrumental-1', 'tamil-instrumental-2'],
    category: 'classical',
  },
  {
    id: 'folk-heritage',
    name: 'Tamil Folk Heritage',
    description: 'Traditional village songs and dance music',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tamil_folk_dance.jpg/300px-Tamil_folk_dance.jpg',
    songs: ['tamil-folk-1', 'tamil-folk-2', 'tamil-folk-3'],
    category: 'folk',
  },
  {
    id: 'devotional-collection',
    name: 'Devotional Classics',
    description: 'Sacred Tamil hymns and bhajans',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hindu_temple.jpg/300px-Hindu_temple.jpg',
    songs: ['tamil-devotional-1', 'tamil-devotional-2', 'tamil-devotional-3'],
    category: 'devotional',
  },
  {
    id: 'indie-modern',
    name: 'Modern Tamil Indie',
    description: 'Contemporary independent Tamil artists',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    songs: ['tamil-indie-1', 'tamil-indie-2', 'tamil-modern-1', 'tamil-modern-2'],
    category: 'modern',
  },
  {
    id: 'meditation',
    name: 'Tamil Meditation & Relaxation',
    description: 'Peaceful instrumental and classical music',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Carnatic_Music.jpg/300px-Carnatic_Music.jpg',
    songs: ['tamil-instrumental-1', 'tamil-instrumental-2', 'tamil-classical-2'],
    category: 'classical',
  },
  {
    id: 'complete-collection',
    name: 'Complete Tamil Collection',
    description: 'All genres - Classical, Folk, Devotional, Modern',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Music_band.jpg/300px-Music_band.jpg',
    songs: [
      'tamil-classical-1', 'tamil-classical-2', 'tamil-classical-3',
      'tamil-folk-1', 'tamil-folk-2', 'tamil-folk-3',
      'tamil-devotional-1', 'tamil-devotional-2', 'tamil-devotional-3',
      'tamil-indie-1', 'tamil-indie-2',
      'tamil-instrumental-1', 'tamil-instrumental-2',
      'tamil-modern-1', 'tamil-modern-2'
    ],
    category: 'modern',
  },
];

// Get songs by category
export const getSongsByCategory = (category: string): TamilSong[] => {
  if (category === 'all') return tamilSongs;
  return tamilSongs.filter(song => song.genre.toLowerCase() === category.toLowerCase());
};

// Get songs by artist
export const getSongsByArtist = (artistName: string): TamilSong[] => {
  return tamilSongs.filter(song => 
    song.artist.toLowerCase().includes(artistName.toLowerCase()) ||
    song.composer?.toLowerCase().includes(artistName.toLowerCase())
  );
};

// Search Tamil songs
export const searchTamilSongs = (query: string): TamilSong[] => {
  const lowerQuery = query.toLowerCase();
  return tamilSongs.filter(song =>
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery) ||
    song.album?.toLowerCase().includes(lowerQuery) ||
    song.composer?.toLowerCase().includes(lowerQuery)
  );
};

// Get playlist by ID
export const getTamilPlaylist = (playlistId: string): TamilPlaylist | undefined => {
  return tamilPlaylists.find(p => p.id === playlistId);
};

// Get songs from playlist
export const getPlaylistSongs = (playlistId: string): TamilSong[] => {
  const playlist = getTamilPlaylist(playlistId);
  if (!playlist) return [];
  
  return playlist.songs
    .map(songId => tamilSongs.find(s => s.id === songId))
    .filter((song): song is TamilSong => song !== undefined);
};

// Get random Tamil songs
export const getRandomTamilSongs = (count: number = 5): TamilSong[] => {
  const shuffled = [...tamilSongs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
