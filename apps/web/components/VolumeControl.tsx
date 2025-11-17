/**
 * Volume Control Component
 */
import { useState, useEffect } from 'react';
import { getState, setVolume } from '@youtify/services';
import styles from '../styles/VolumeControl.module.css';

export const VolumeControl = () => {
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  useEffect(() => {
    const state = getState();
    setVolumeState(state.volume || 80);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setVolumeState(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setVolumeState(0);
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

  return (
    <div className={styles.container}>
      <button className={styles.muteBtn} onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className={styles.slider}
        title={`Volume: ${volume}%`}
      />
      <span className={styles.value}>{volume}%</span>
    </div>
  );
};
