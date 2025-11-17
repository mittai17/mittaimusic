/**
 * Global Mini Player - Shows at bottom of all pages
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getState, subscribe, pause, resume, next, previous, type Track } from '@youtify/services';
import { VolumeControl } from './VolumeControl';
import styles from '../styles/GlobalPlayer.module.css';

export const GlobalPlayer = () => {
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
      setDuration(currentTrack.duration || 180);
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.content}>
        {/* Track Info */}
        <div className={styles.trackInfo} onClick={() => router.push('/player-enhanced')}>
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className={styles.cover} />
          <div className={styles.info}>
            <div className={styles.title}>{currentTrack.title}</div>
            <div className={styles.artist}>{currentTrack.artist}</div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={previous} title="Previous">
            ⏮
          </button>
          <button
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={isPlaying ? pause : resume}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.controlBtn} onClick={next} title="Next">
            ⏭
          </button>
        </div>

        {/* Time */}
        <div className={styles.time}>
          <span>{formatTime(position)}</span>
          <span className={styles.separator}>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume Control */}
        <VolumeControl />

        {/* Expand Button */}
        <button
          className={styles.expandBtn}
          onClick={() => router.push('/player-enhanced')}
          title="Open Player"
        >
          ⬆
        </button>
      </div>
    </div>
  );
};
