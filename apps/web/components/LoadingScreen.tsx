/**
 * Loading Screen Component
 */
import styles from '../styles/LoadingScreen.module.css';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <svg viewBox="0 0 100 100" className={styles.logoSvg}>
            <circle cx="50" cy="50" r="45" className={styles.circle} />
            <path d="M 30 50 L 70 30 L 70 70 Z" className={styles.play} />
          </svg>
        </div>
        <h2 className={styles.title}>Mittai's Music</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.spinner}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    </div>
  );
};
