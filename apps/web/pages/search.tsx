import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { type Track } from '@youtify/services';
import { searchYouTube, type YouTubeVideo } from '../lib/youtube';
import { play } from '@youtify/services';
import { useRouter } from 'next/router';
import styles from '../styles/Search.module.css';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  preview_url: string | null;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const [youtubeResults, setYoutubeResults] = useState<YouTubeVideo[]>([]);
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'youtube' | 'spotify' | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [hasSpotifyToken, setHasSpotifyToken] = useState(false);

  // Load recent searches and check Spotify token
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Check if user has Spotify token
    const spotifyToken = sessionStorage.getItem('spotify_temp_token');
    setHasSpotifyToken(!!spotifyToken);
  }, []);

  // Save to recent searches
  const saveToRecentSearches = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setYoutubeResults([]);
      setSpotifyResults([]);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Save to recent searches
        saveToRecentSearches(query);

        // Search YouTube
        if (searchType === 'youtube' || searchType === 'all') {
          try {
            console.log('Searching YouTube for:', query);
            const ytResults = await searchYouTube(query, 20);
            console.log('YouTube results:', ytResults);
            setYoutubeResults(ytResults);
          } catch (error) {
            console.error('YouTube search error:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setError(`YouTube search failed: ${errorMsg}`);
            setYoutubeResults([]);
          }
        } else {
          setYoutubeResults([]);
        }

        // Search Spotify
        if ((searchType === 'spotify' || searchType === 'all') && hasSpotifyToken) {
          try {
            console.log('Searching Spotify for:', query);
            const spotifyToken = sessionStorage.getItem('spotify_temp_token');
            
            if (spotifyToken) {
              const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
                {
                  headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                setSpotifyResults(data.tracks.items);
                console.log('Spotify results:', data.tracks.items);
              } else {
                console.error('Spotify search failed:', response.status);
                setSpotifyResults([]);
              }
            }
          } catch (error) {
            console.error('Spotify search error:', error);
            setSpotifyResults([]);
          }
        } else {
          setSpotifyResults([]);
        }

        // Check if no results
        if (youtubeResults.length === 0 && spotifyResults.length === 0) {
          setError('No results found. Try a different search term.');
        }
      } catch (error) {
        console.error('Search error:', error);
        setError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchType]);

  return (
    <>
      <Head>
        <title>Search - Mittai's Music</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Back
          </Link>
          <h1 className={styles.headerTitle}>Search Music</h1>
          <div className={styles.headerSpacer}></div>
        </header>

        <main className={styles.main}>
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search for songs, artists, albums..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowRecentSearches(true)}
                onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
                className={styles.searchInput}
                autoFocus
              />
              {query && (
                <button 
                  className={styles.clearButton}
                  onClick={() => setQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Recent Searches */}
            {showRecentSearches && !query && recentSearches.length > 0 && (
              <div className={styles.recentSearches}>
                <div className={styles.recentHeader}>
                  <span>Recent Searches</span>
                  <button 
                    className={styles.clearRecent}
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recentSearches');
                    }}
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className={styles.recentItem}
                    onClick={() => setQuery(search)}
                  >
                    <span className={styles.recentIcon}>🕐</span>
                    {search}
                  </button>
                ))}
              </div>
            )}

            <div className={styles.searchTabs}>
              <button
                className={`${styles.tab} ${searchType === 'all' ? styles.tabActive : ''}`}
                onClick={() => setSearchType('all')}
              >
                <span className={styles.tabIcon}>🌐</span>
                All Sources
              </button>
              <button
                className={`${styles.tab} ${searchType === 'youtube' ? styles.tabActive : ''}`}
                onClick={() => setSearchType('youtube')}
              >
                <span className={styles.tabIcon}>📺</span>
                YouTube
              </button>
              {hasSpotifyToken && (
                <button
                  className={`${styles.tab} ${searchType === 'spotify' ? styles.tabActive : ''}`}
                  onClick={() => setSearchType('spotify')}
                >
                  <span className={styles.tabIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </span>
                  Spotify
                </button>
              )}
            </div>
            
            {!hasSpotifyToken && (
              <div className={styles.spotifyHint}>
                <span>💡</span>
                <span>
                  Want Spotify results? <Link href="/spotify-test" style={{ color: '#1db954', textDecoration: 'underline' }}>Add your token</Link>
                </span>
              </div>
            )}
          </div>

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Searching for "{query}"...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className={styles.errorBanner}>
              <span className={styles.errorIcon}>ℹ️</span>
              <div className={styles.errorContent}>
                <strong>Note:</strong> {error}
                {error.includes('expired') && (
                  <div className={styles.errorHint}>
                    Showing mock data. See GET_NEW_API_KEY.md for real YouTube results.
                  </div>
                )}
              </div>
            </div>
          )}

          {(youtubeResults.length > 0 || spotifyResults.length > 0) && (
            <div className={styles.results}>
              {/* Spotify Results */}
              {spotifyResults.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                      <span className={styles.sectionIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </span>
                      Spotify Results
                    </h2>
                    <span className={styles.resultCount}>{spotifyResults.length} songs</span>
                  </div>
                  <div className={styles.gridResults}>
                    {spotifyResults.map((track) => {
                      const convertedTrack: Track = {
                        id: track.id,
                        title: track.name,
                        artist: track.artists.map(a => a.name).join(', '),
                        artistId: track.artists[0]?.name || '',
                        duration: Math.floor(track.duration_ms / 1000),
                        coverUrl: track.album.images[0]?.url || '',
                        audioUrl: track.preview_url || `spotify:${track.id}`,
                        genre: 'Spotify',
                      };
                      return (
                        <div key={track.id} className={styles.resultCard}>
                          <div className={styles.cardThumbnail}>
                            <img src={track.album.images[0]?.url} alt={track.name} />
                            <button 
                              className={styles.playOverlay}
                              onClick={async () => {
                                await play(convertedTrack);
                                router.push('/player-enhanced');
                              }}
                            >
                              <span className={styles.playIcon}>▶</span>
                            </button>
                          </div>
                          <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{track.name}</h3>
                            <p className={styles.cardArtist}>{track.artists.map(a => a.name).join(', ')}</p>
                            <p className={styles.cardAlbum}>{track.album.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* YouTube Results */}
              {youtubeResults.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                      <span className={styles.sectionIcon}>🎵</span>
                      YouTube Results
                    </h2>
                    <span className={styles.resultCount}>{youtubeResults.length} songs</span>
                  </div>
                  <div className={styles.gridResults}>
                    {youtubeResults.map((video) => {
                      const track: Track = {
                        id: video.videoId,
                        title: video.title,
                        artist: video.channelTitle,
                        artistId: `yt-${video.channelTitle}`,
                        duration: 0,
                        coverUrl: video.thumbnail,
                        audioUrl: `youtube:${video.videoId}`,
                        genre: 'YouTube',
                      };
                      return (
                        <div key={video.videoId} className={styles.resultCard}>
                          <div className={styles.cardThumbnail}>
                            <img src={video.thumbnail} alt={video.title} />
                            <button 
                              className={styles.playOverlay}
                              onClick={async () => {
                                await play(track);
                                router.push('/player-enhanced');
                              }}
                            >
                              <span className={styles.playIcon}>▶</span>
                            </button>
                          </div>
                          <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{video.title}</h3>
                            <p className={styles.cardArtist}>{video.channelTitle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {!loading && 
               youtubeResults.length === 0 && 
               spotifyResults.length === 0 && (
                <div className={styles.noResults}>No results found</div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
