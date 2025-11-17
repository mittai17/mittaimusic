export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string; // TODO: Replace with real audio source URL
  genre?: string;
  tags?: string[];
  mood?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  popularity?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  tracks: Track[];
  ownerId: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers?: number;
}

export interface HomeData {
  featuredPlaylists: Playlist[];
  trendingPlaylists: Playlist[];
  genres: Array<{ id: string; name: string; coverUrl: string }>;
  recommendedTracks: Track[];
}

export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  playlists: Playlist[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number; // current position in seconds
  queue: Track[];
  queueIndex: number;
  volume: number;
}

