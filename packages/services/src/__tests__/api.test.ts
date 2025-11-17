/**
 * Unit test for search function
 */

import { search, initMockData } from '../api';
import type { Track, Playlist } from '../types';

describe('search', () => {
  beforeEach(() => {
    // Initialize mock data
    const mockTracks: Track[] = [
      {
        id: '1',
        title: 'Test Song',
        artist: 'Test Artist',
        artistId: 'artist-1',
        duration: 180,
        coverUrl: 'test.jpg',
        audioUrl: 'test.mp3',
      },
      {
        id: '2',
        title: 'Another Song',
        artist: 'Different Artist',
        artistId: 'artist-2',
        duration: 200,
        coverUrl: 'test2.jpg',
        audioUrl: 'test2.mp3',
      },
    ];

    const mockPlaylists: Playlist[] = [
      {
        id: 'playlist-1',
        name: 'Test Playlist',
        description: 'A test playlist',
        coverUrl: 'playlist.jpg',
        tracks: mockTracks,
        ownerId: 'user-1',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    initMockData({
      tracks: mockTracks,
      playlists: mockPlaylists,
    });
  });

  it('should return empty results for empty query', async () => {
    const results = await search('');
    expect(results.tracks).toHaveLength(0);
    expect(results.artists).toHaveLength(0);
    expect(results.playlists).toHaveLength(0);
  });

  it('should find tracks by title', async () => {
    const results = await search('Test Song');
    expect(results.tracks).toHaveLength(1);
    expect(results.tracks[0].title).toBe('Test Song');
  });

  it('should find tracks by artist', async () => {
    const results = await search('Test Artist');
    expect(results.tracks).toHaveLength(1);
    expect(results.tracks[0].artist).toBe('Test Artist');
  });

  it('should find playlists by name', async () => {
    const results = await search('Test Playlist');
    expect(results.playlists).toHaveLength(1);
    expect(results.playlists[0].name).toBe('Test Playlist');
  });

  it('should be case insensitive', async () => {
    const results = await search('test song');
    expect(results.tracks).toHaveLength(1);
  });

  it('should return empty results for no matches', async () => {
    const results = await search('NonExistent');
    expect(results.tracks).toHaveLength(0);
    expect(results.playlists).toHaveLength(0);
  });
});

