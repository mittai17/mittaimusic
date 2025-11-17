import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SplashScreen } from '../components/SplashScreen';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Redirect to home page after splash
    setTimeout(() => {
      router.push('/home');
    }, 100);
  };

  return (
    <>
      <Head>
        <title>Mittai's Music - Music Streaming</title>
        <meta name="description" content="Modern music streaming app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading Mittai's Music...</p>
          </div>
        </div>
      )}
    </>
  );
}
