import { useEffect, useState } from 'react';
import styles from '../styles/SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <div className={styles.playButton}>
            <span className={styles.playIcon}>▶</span>
          </div>
        </div>
        <h1 className={styles.title}>Mittai's Music</h1>
        <p className={styles.subtitle}>Your music, your way</p>
      </div>
      <div className={styles.loader}>
        <div className={styles.loaderBar}></div>
      </div>
    </div>
  );
}
