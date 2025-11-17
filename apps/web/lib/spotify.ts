/**
 * Spotify Web API Integration
 * Handles authentication and API calls to Spotify
 */

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
  preview_url: string | null;
  uri: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  country: string;
  product: string;
}

// Generate authorization URL
export const getSpotifyAuthUrl = (): string => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-modify-playback-state',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: scopes,
    show_dialog: 'true',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Exchange authorization code for access token
export const getSpotifyAccessToken = async (code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  return response.json();
};

// Refresh access token
export const refreshSpotifyToken = async (refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
};

// Get current user profile
export const getSpotifyUser = async (accessToken: string): Promise<SpotifyUser> => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }

  return response.json();
};

// Get user's playlists
export const getUserPlaylists = async (accessToken: string, limit: number = 50): Promise<SpotifyPlaylist[]> => {
  const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get playlists');
  }

  const data = await response.json();
  return data.items;
};

// Get user's saved tracks
export const getSavedTracks = async (accessToken: string, limit: number = 50): Promise<SpotifyTrack[]> => {
  const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get saved tracks');
  }

  const data = await response.json();
  return data.items.map((item: any) => item.track);
};

// Get user's top tracks
export const getTopTracks = async (
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 50
): Promise<SpotifyTrack[]> => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get top tracks');
  }

  const data = await response.json();
  return data.items;
};

// Get recently played tracks
export const getRecentlyPlayed = async (accessToken: string, limit: number = 50): Promise<SpotifyTrack[]> => {
  const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get recently played');
  }

  const data = await response.json();
  return data.items.map((item: any) => item.track);
};

// Get playlist tracks
export const getPlaylistTracks = async (
  accessToken: string,
  playlistId: string,
  limit: number = 100
): Promise<SpotifyTrack[]> => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get playlist tracks');
  }

  const data = await response.json();
  return data.items.map((item: any) => item.track);
};

// Search Spotify
export const searchSpotify = async (
  accessToken: string,
  query: string,
  type: 'track' | 'artist' | 'album' | 'playlist' = 'track',
  limit: number = 20
): Promise<any> => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search Spotify');
  }

  const data = await response.json();
  return data[`${type}s`].items;
};

// Convert Spotify track to app Track format
export const convertSpotifyTrack = (spotifyTrack: SpotifyTrack) => {
  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map(a => a.name).join(', '),
    artistId: spotifyTrack.artists[0]?.id || '',
    duration: Math.floor(spotifyTrack.duration_ms / 1000),
    coverUrl: spotifyTrack.album.images[0]?.url || '',
    audioUrl: spotifyTrack.preview_url || spotifyTrack.uri,
    genre: 'Spotify',
  };
};
