import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function PlayerPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Redirect to enhanced player
      router.replace('/player-enhanced');
    }
  }, [mounted, router]);

  return (
    <>
      <Head>
        <title>Player - Mittai's Music</title>
      </Head>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#b3b3b3',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #1a1a1a',
              borderTopColor: '#1db954',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p>Redirecting to player...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default PlayerPage;
