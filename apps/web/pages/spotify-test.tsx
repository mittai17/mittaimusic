import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { play } from '@youtify/services';
import styles from '../styles/SpotifyLibrary.module.css';

export default function SpotifyTest() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!token.trim()) {
      setError('Please enter a token');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/spotify/test-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to test token');
      } else {
        setResult(data);
        
        // Store token temporarily in sessionStorage
        sessionStorage.setItem('spotify_temp_token', token);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track: any) => {
    const convertedTrack = {
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      artistId: track.artists[0]?.id || '',
      duration: Math.floor(track.duration_ms / 1000),
      coverUrl: track.album.images[0]?.url || '',
      audioUrl: track.preview_url || track.uri,
      genre: 'Spotify',
    };

    await play(convertedTrack);
    router.push('/player-enhanced');
  };

  return (
    <>
      <Head>
        <title>Test Spotify Token - Mittai's Music</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard} style={{ maxWidth: '800px' }}>
            <h1 className={styles.loginTitle}>Test Spotify Token</h1>
            <p className={styles.loginSubtitle}>
              Paste your Spotify Bearer token to test the integration
            </p>

            <div style={{ marginBottom: '20px' }}>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your Spotify Bearer token here..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              className={styles.loginButton}
              onClick={handleTest}
              disabled={loading}
            >
              {loading ? 'Testing...' : '🧪 Test Token'}
            </button>

            {error && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.3)',
                  borderRadius: '12px',
                  color: '#ff3b30',
                }}
              >
                <strong>Error:</strong> {error}
                <div style={{ marginTop: '10px', fontSize: '13px' }}>
                  Note: Tokens expire quickly. Get a new one from Spotify's API console.
                </div>
              </div>
            )}

            {result && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  background: 'rgba(29, 185, 84, 0.1)',
                  border: '1px solid rgba(29, 185, 84, 0.3)',
                  borderRadius: '12px',
                }}
              >
                <h3 style={{ color: '#1db954', marginBottom: '16px' }}>
                  ✅ Token Valid!
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <strong>User:</strong> {result.user.display_name}
                  <br />
                  <strong>Email:</strong> {result.user.email}
                  <br />
                  <strong>Country:</strong> {result.user.country}
                  <br />
                  <strong>Product:</strong> {result.user.product}
                </div>

                <h4 style={{ color: '#1db954', marginBottom: '12px' }}>
                  Your Top Tracks:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.topTracks.map((track: any, index: number) => (
                    <div
                      key={track.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePlayTrack(track)}
                    >
                      <div
                        style={{
                          width: '30px',
                          textAlign: 'center',
                          color: '#b3b3b3',
                          fontWeight: 'bold',
                        }}
                      >
                        #{index + 1}
                      </div>
                      <img
                        src={track.album.images[2]?.url}
                        alt={track.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '4px',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {track.name}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#b3b3b3',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {track.artists.map((a: any) => a.name).join(', ')}
                        </div>
                      </div>
                      <button
                        style={{
                          padding: '8px 16px',
                          background: '#1db954',
                          border: 'none',
                          borderRadius: '20px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Play
                      </button>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#ffc107',
                  }}
                >
                  <strong>⚠️ Note:</strong> This token will expire soon. For permanent access,
                  set up OAuth in <code>SPOTIFY_SETUP.md</code>
                </div>
              </div>
            )}

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <Link href="/" className={styles.backLink}>
                ← Back to Home
              </Link>
              <span style={{ margin: '0 12px', color: '#666' }}>|</span>
              <Link href="/spotify-library" className={styles.backLink}>
                Spotify Library (OAuth)
              </Link>
            </div>

            <div
              style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#b3b3b3',
                textAlign: 'left',
              }}
            >
              <h4 style={{ color: 'white', marginBottom: '12px' }}>
                How to get a token:
              </h4>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>
                  Visit:{' '}
                  <a
                    href="https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/"
                    target="_blank"
                    rel="noopener"
                    style={{ color: '#1db954' }}
                  >
                    Spotify API Console
                  </a>
                </li>
                <li>Click "Get Token"</li>
                <li>Select scopes: user-read-private, user-read-email, user-top-read</li>
                <li>Copy the token and paste it above</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
