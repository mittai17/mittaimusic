import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/SpotifyLibrary.module.css';

export default function SpotifyDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkConfig = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    setDebugInfo({
      clientId: clientId || 'NOT SET',
      clientIdLength: clientId?.length || 0,
      redirectUri: redirectUri || 'NOT SET',
      hasClientSecret: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
      currentUrl: window.location.href,
      cookies: document.cookie,
    });
  };

  const testAuth = async () => {
    try {
      const response = await fetch('/api/spotify/me');
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <>
      <Head>
        <title>Spotify Debug - Mittai's Music</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard} style={{ maxWidth: '800px' }}>
            <h1 className={styles.loginTitle}>Spotify Debug</h1>
            <p className={styles.loginSubtitle}>Check your Spotify configuration</p>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
              <button className={styles.loginButton} onClick={checkConfig}>
                Check Config
              </button>
              <button className={styles.loginButton} onClick={testAuth}>
                Test Auth
              </button>
            </div>

            {debugInfo && (
              <div
                style={{
                  textAlign: 'left',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '20px',
                  borderRadius: '12px',
                  marginTop: '20px',
                }}
              >
                <h3 style={{ color: '#1db954', marginBottom: '16px' }}>Configuration:</h3>
                <pre
                  style={{
                    fontSize: '12px',
                    color: 'white',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ color: '#1db954', marginBottom: '12px' }}>Status:</h4>
                  <ul style={{ color: 'white', lineHeight: '1.8' }}>
                    <li>
                      Client ID: {debugInfo.clientId !== 'NOT SET' ? '✅ Set' : '❌ Missing'}
                    </li>
                    <li>
                      Client Secret: {debugInfo.hasClientSecret ? '✅ Set' : '❌ Missing'}
                    </li>
                    <li>
                      Redirect URI: {debugInfo.redirectUri !== 'NOT SET' ? '✅ Set' : '❌ Missing'}
                    </li>
                  </ul>
                </div>

                {debugInfo.clientId === 'NOT SET' && (
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
                    <strong>⚠️ Configuration Missing!</strong>
                    <p style={{ marginTop: '8px', fontSize: '14px' }}>
                      Your Spotify credentials are not set. Please:
                    </p>
                    <ol style={{ marginTop: '8px', paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Check apps/web/.env.local file exists</li>
                      <li>Verify NEXT_PUBLIC_SPOTIFY_CLIENT_ID is set</li>
                      <li>Verify NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET is set</li>
                      <li>Restart the dev server</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: '#1db954', marginBottom: '12px' }}>Quick Fixes:</h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'left',
                }}
              >
                <h4 style={{ color: 'white', marginBottom: '12px' }}>1. Check .env.local</h4>
                <pre
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#1db954',
                    overflow: 'auto',
                  }}
                >
                  {`NEXT_PUBLIC_SPOTIFY_CLIENT_ID=40a831c8dc574f879ba48ef3f8311ca8
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=aadde63c12614309b8aff240a5b590e8
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback`}
                </pre>

                <h4 style={{ color: 'white', marginTop: '20px', marginBottom: '12px' }}>
                  2. Restart Server
                </h4>
                <pre
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#1db954',
                  }}
                >
                  {`# Stop server (Ctrl+C)
# Then restart:
npm run dev`}
                </pre>

                <h4 style={{ color: 'white', marginTop: '20px', marginBottom: '12px' }}>
                  3. Test Connection
                </h4>
                <p style={{ color: '#b3b3b3', fontSize: '14px' }}>
                  After restarting, click "Check Config" above to verify.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <Link href="/" className={styles.backLink}>
                ← Back to Home
              </Link>
              <span style={{ margin: '0 12px', color: '#666' }}>|</span>
              <Link href="/spotify-library" className={styles.backLink}>
                Try Spotify Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
