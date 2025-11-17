import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getState, subscribe, pause, resume, next, previous, type Track } from '@youtify/services';
import { CoverImage } from '@youtify/ui';
import styles from '../styles/MiniPlayer.module.css';

export const MiniPlayer: React.FC = () => {
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.isPlaying);
      setPosition(state.position);
    });

    const state = getState();
    setCurrentTrack(state.currentTrack);
    setIsPlaying(state.isPlaying);
    setPosition(state.position);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.duration);
    }
  }, [currentTrack]);

  if (!currentTrack || router.pathname === '/player') {
    return null;
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    next();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    previous();
  };

  return (
    <div className={styles.miniPlayer} onClick={() => router.push('/player')}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      
      <div className={styles.content}>
        <div className={styles.trackInfo}>
          <CoverImage source={{ uri: currentTrack.coverUrl }} size={48} />
          <div className={styles.trackDetails}>
            <div className={styles.trackTitle}>{currentTrack.title}</div>
            <div className={styles.trackArtist}>{currentTrack.artist}</div>
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={handlePrevious}>
            ⏮
          </button>
          <button className={styles.playBtn} onClick={handlePlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.controlBtn} onClick={handleNext}>
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
};
