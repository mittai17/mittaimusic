/**
 * Keyboard Shortcuts Hook
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { pause, resume, next, previous, getState } from '@youtify/services';

export const useKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const state = getState();

      switch (e.key.toLowerCase()) {
        case ' ':
          // Space - Play/Pause
          e.preventDefault();
          if (state.isPlaying) {
            pause();
          } else if (state.currentTrack) {
            resume();
          }
          break;

        case 'arrowright':
          // Right Arrow - Next track
          if (e.shiftKey) {
            next();
          }
          break;

        case 'arrowleft':
          // Left Arrow - Previous track
          if (e.shiftKey) {
            previous();
          }
          break;

        case 's':
          // S - Go to search
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/search');
          }
          break;

        case 'h':
          // H - Go to home
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/home');
          }
          break;

        case 'p':
          // P - Go to player
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/player-enhanced');
          }
          break;

        case 'l':
          // L - Go to Spotify library
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/spotify-library');
          }
          break;

        case '?':
          // ? - Show keyboard shortcuts
          e.preventDefault();
          alert(`
Keyboard Shortcuts:

Space - Play/Pause
Shift + → - Next track
Shift + ← - Previous track

Ctrl/Cmd + S - Search
Ctrl/Cmd + H - Home
Ctrl/Cmd + P - Player
Ctrl/Cmd + L - Spotify Library
          `);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
};
