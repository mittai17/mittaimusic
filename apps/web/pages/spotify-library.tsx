import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { play } from '@youtify/services';
import {
  getSpotifyAuthUrl,
  convertSpotifyTrack,
  type SpotifyPlaylist,
  type SpotifyTrack,
  type SpotifyUser,
} from '../lib/spotify';
import styles from '../styles/SpotifyLibrary.module.css';

export default function SpotifyLibrary() {
  const router = useRouter();
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [savedTracks, setSavedTracks] = useState<SpotifyTrack[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'playlists' | 'saved' | 'top' | 'recent'>('playlists');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/spotify/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        loadLibrary();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const [playlistsData, savedData, topData, recentData] = await Promise.all([
        fetch('/api/spotify/playlists').then(r => r.json()),
        fetch('/api/spotify/saved-tracks').then(r => r.json()),
        fetch('/api/spotify/top-tracks').then(r => r.json()),
        fetch('/api/spotify/recently-played').then(r => r.json()),
      ]);

      setPlaylists(playlistsData);
      setSavedTracks(savedData);
      setTopTracks(topData);
      setRecentTracks(recentData);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handlePlayTrack = async (spotifyTrack: SpotifyTrack) => {
    const track = convertSpotifyTrack(spotifyTrack);
    await play(track);
    router.push('/player-enhanced');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Connect Spotify - Mittai's Music</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
              <div className={styles.spotifyLogo}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <h1 className={styles.loginTitle}>Connect to Spotify</h1>
              <p className={styles.loginSubtitle}>
                Access your playlists, saved songs, and personalized recommendations
              </p>
              <button className={styles.loginButton} onClick={handleLogin}>
                <span className={styles.loginButtonIcon}>🎵</span>
                Connect with Spotify
              </button>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Access your playlists</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>View saved songs</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>See your top tracks</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Recently played</span>
                </div>
              </div>
              <Link href="/" className={styles.backLink}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Spotify Library - Mittai's Music</title>
      </Head>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Back
          </Link>
          <div className={styles.userInfo}>
            {user?.images?.[0] && (
              <img src={user.images[0].url} alt={user.display_name} className={styles.userAvatar} />
            )}
            <div>
              <div className={styles.userName}>{user?.display_name}</div>
              <div className={styles.userBadge}>Spotify {user?.product}</div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'playlists' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            <span className={styles.tabIcon}>📋</span>
            Playlists ({playlists.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'saved' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <span className={styles.tabIcon}>❤️</span>
            Saved ({savedTracks.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'top' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('top')}
          >
            <span className={styles.tabIcon}>⭐</span>
            Top Tracks ({topTracks.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'recent' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            <span className={styles.tabIcon}>🕐</span>
            Recent ({recentTracks.length})
          </button>
        </div>

        {/* Content */}
        <main className={styles.main}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading your Spotify library...</p>
            </div>
          ) : (
            <>
              {/* Playlists */}
              {activeTab === 'playlists' && (
                <div className={styles.grid}>
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className={styles.playlistCard}>
                      <div className={styles.playlistImage}>
                        <img
                          src={playlist.images[0]?.url || '/placeholder-playlist.png'}
                          alt={playlist.name}
                        />
                        <div className={styles.playlistOverlay}>
                          <button className={styles.playButton}>▶</button>
                        </div>
                      </div>
                      <div className={styles.playlistInfo}>
                        <h3 className={styles.playlistName}>{playlist.name}</h3>
                        <p className={styles.playlistMeta}>
                          {playlist.tracks.total} tracks • {playlist.owner.display_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved Tracks */}
              {activeTab === 'saved' && (
                <div className={styles.trackList}>
                  {savedTracks.map((track, index) => (
                    <div key={track.id} className={styles.trackItem} onClick={() => handlePlayTrack(track)}>
                      <div className={styles.trackNumber}>{index + 1}</div>
                      <img src={track.album.images[2]?.url} alt={track.name} className={styles.trackImage} />
                      <div className={styles.trackInfo}>
                        <div className={styles.trackName}>{track.name}</div>
                        <div className={styles.trackArtist}>{track.artists.map(a => a.name).join(', ')}</div>
                      </div>
                      <div className={styles.trackAlbum}>{track.album.name}</div>
                      <div className={styles.trackDuration}>
                        {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Top Tracks */}
              {activeTab === 'top' && (
                <div className={styles.grid}>
                  {topTracks.map((track, index) => (
                    <div key={track.id} className={styles.trackCard} onClick={() => handlePlayTrack(track)}>
                      <div className={styles.trackCardImage}>
                        <img src={track.album.images[0]?.url} alt={track.name} />
                        <div className={styles.trackCardOverlay}>
                          <button className={styles.playButton}>▶</button>
                        </div>
                        <div className={styles.rankBadge}>#{index + 1}</div>
                      </div>
                      <div className={styles.trackCardInfo}>
                        <h3 className={styles.trackCardName}>{track.name}</h3>
                        <p className={styles.trackCardArtist}>{track.artists.map(a => a.name).join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Tracks */}
              {activeTab === 'recent' && (
                <div className={styles.grid}>
                  {recentTracks.map((track) => (
                    <div key={track.id} className={styles.trackCard} onClick={() => handlePlayTrack(track)}>
                      <div className={styles.trackCardImage}>
                        <img src={track.album.images[0]?.url} alt={track.name} />
                        <div className={styles.trackCardOverlay}>
                          <button className={styles.playButton}>▶</button>
                        </div>
                      </div>
                      <div className={styles.trackCardInfo}>
                        <h3 className={styles.trackCardName}>{track.name}</h3>
                        <p className={styles.trackCardArtist}>{track.artists.map(a => a.name).join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
