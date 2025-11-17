import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { 
  initPlayer, 
  initAuth, 
  initMockData,
  initializeRecommendations,
  startAutoSave,
  trackSongPlay,
  trackSongEnd,
  getState,
  subscribe,
} from '@youtify/services';
import { GlobalPlayer } from '../components/GlobalPlayer';
import { Navigation } from '../components/Navigation';
import mockData from '../public/mock/data.json';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  
  useEffect(() => {
    // Initialize services
    initPlayer();
    initAuth();
    initMockData(mockData);
    
    // Initialize recommendation engine
    initializeRecommendations();
    
    // Start auto-save (every minute)
    const stopAutoSave = startAutoSave(60000);
    
    // Track listening events
    let currentTrack = getState().currentTrack;
    let isPlaying = getState().isPlaying;
    
    const unsubscribe = subscribe((state) => {
      const prevTrack = currentTrack;
      const prevPlaying = isPlaying;
      
      currentTrack = state.currentTrack;
      isPlaying = state.isPlaying;
      
      // Track song play
      if (state.currentTrack && state.isPlaying && 
          (!prevTrack || prevTrack.id !== state.currentTrack.id)) {
        // Ensure genre is set
        const trackWithGenre = {
          ...state.currentTrack,
          genre: state.currentTrack.genre || 'Other',
        };
        trackSongPlay(trackWithGenre);
      }
      
      // Track song end
      if (prevTrack && prevPlaying && 
          (!state.currentTrack || state.currentTrack.id !== prevTrack.id)) {
        const completed = state.currentTrack !== null;
        trackSongEnd(prevTrack.id, completed, !completed);
      }
    });
    
    return () => {
      stopAutoSave();
      unsubscribe();
    };
  }, []);

  // Pages that should not show navigation
  const noNavPages = ['/login', '/signup'];
  const showNav = !noNavPages.includes(router.pathname);

  return (
    <ErrorBoundary>
      {showNav && <Navigation />}
      <div style={{ paddingTop: showNav ? '64px' : '0', paddingBottom: '80px' }}>
        <Component {...pageProps} />
      </div>
      <GlobalPlayer />
    </ErrorBoundary>
  );
}

