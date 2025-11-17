/**
 * React Hook for Siri Shortcuts
 * 
 * Easy integration of Siri voice commands in React Native
 */

// @ts-ignore
import { useEffect, useCallback, useRef } from 'react';
import {
  SiriShortcutsAPI,
  donatePlayTrack,
  donateGetRecommendations,
  donatePlayPlaylist,
  donatePlaySimilar,
  onSiriCommand,
  type SiriCommand,
} from '../ios/SiriShortcutsModule';

interface SiriHandlers {
  onPlayTrack?: (trackName: string, artist?: string) => void;
  onGetRecommendations?: (count?: number) => void;
  onPlayPlaylist?: (playlistName: string) => void;
  onSearchMusic?: (query: string) => void;
  onPlaySimilar?: (trackName: string) => void;
}

interface UseSiriShortcutsReturn {
  donatePlayTrack: (trackName: string, artist: string) => Promise<void>;
  donateGetRecommendations: () => Promise<void>;
  donatePlayPlaylist: (playlistName: string) => Promise<void>;
  donatePlaySimilar: (trackName: string) => Promise<void>;
  presentAddToSiri: (activityType: string, title: string) => Promise<void>;
}

/**
 * Hook for Siri Shortcuts integration
 * 
 * @example
 * ```typescript
 * const { donatePlayTrack } = useSiriShortcuts({
 *   onPlayTrack: (trackName) => {
 *     console.log('Siri wants to play:', trackName);
 *     playTrack(trackName);
 *   },
 *   onGetRecommendations: () => {
 *     console.log('Siri wants recommendations');
 *     showRecommendations();
 *   },
 * });
 * 
 * // Donate shortcut when user plays a track
 * await donatePlayTrack('Shape of You', 'Ed Sheeran');
 * ```
 */
export function useSiriShortcuts(handlers: SiriHandlers = {}): UseSiriShortcutsReturn {
  const handlersRef = useRef(handlers);

  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Register Siri command listeners
  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    // Play Track
    if (handlers.onPlayTrack) {
      const unsub = onSiriCommand('playTrack', (command: SiriCommand) => {
        const { trackName, artist } = command.data;
        handlersRef.current.onPlayTrack?.(trackName, artist);
      });
      unsubscribers.push(unsub);
    }

    // Get Recommendations
    if (handlers.onGetRecommendations) {
      const unsub = onSiriCommand('getRecommendations', (command: SiriCommand) => {
        const { count } = command.data;
        handlersRef.current.onGetRecommendations?.(count);
      });
      unsubscribers.push(unsub);
    }

    // Play Playlist
    if (handlers.onPlayPlaylist) {
      const unsub = onSiriCommand('playPlaylist', (command: SiriCommand) => {
        const { playlistName } = command.data;
        handlersRef.current.onPlayPlaylist?.(playlistName);
      });
      unsubscribers.push(unsub);
    }

    // Search Music
    if (handlers.onSearchMusic) {
      const unsub = onSiriCommand('searchMusic', (command: SiriCommand) => {
        const { query } = command.data;
        handlersRef.current.onSearchMusic?.(query);
      });
      unsubscribers.push(unsub);
    }

    // Play Similar
    if (handlers.onPlaySimilar) {
      const unsub = onSiriCommand('playSimilar', (command: SiriCommand) => {
        const { trackName } = command.data;
        handlersRef.current.onPlaySimilar?.(trackName);
      });
      unsubscribers.push(unsub);
    }

    // Cleanup
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [handlers]);

  const handleDonatePlayTrack = useCallback(async (trackName: string, artist: string) => {
    await donatePlayTrack(trackName, artist);
  }, []);

  const handleDonateGetRecommendations = useCallback(async () => {
    await donateGetRecommendations();
  }, []);

  const handleDonatePlayPlaylist = useCallback(async (playlistName: string) => {
    await donatePlayPlaylist(playlistName);
  }, []);

  const handleDonatePlaySimilar = useCallback(async (trackName: string) => {
    await donatePlaySimilar(trackName);
  }, []);

  const presentAddToSiri = useCallback(async (activityType: string, title: string) => {
    await SiriShortcutsAPI.presentShortcut({
      activityType,
      title,
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
    });
  }, []);

  return {
    donatePlayTrack: handleDonatePlayTrack,
    donateGetRecommendations: handleDonateGetRecommendations,
    donatePlayPlaylist: handleDonatePlayPlaylist,
    donatePlaySimilar: handleDonatePlaySimilar,
    presentAddToSiri,
  };
}

/**
 * Hook for automatic shortcut donation
 * Automatically donates shortcuts when actions are performed
 * 
 * @example
 * ```typescript
 * useAutoDonateSiriShortcuts({
 *   enabled: true,
 *   donateOnPlay: true,
 *   donateOnRecommendations: true,
 * });
 * ```
 */
export function useAutoDonateSiriShortcuts(options: {
  enabled?: boolean;
  donateOnPlay?: boolean;
  donateOnRecommendations?: boolean;
  donateOnPlaylist?: boolean;
} = {}) {
  const {
    enabled = true,
    donateOnPlay = true,
    donateOnRecommendations = true,
    donateOnPlaylist = true,
  } = options;

  const donatePlayTrackRef = useCallback(async (trackName: string, artist: string) => {
    if (enabled && donateOnPlay) {
      await donatePlayTrack(trackName, artist);
    }
  }, [enabled, donateOnPlay]);

  const donateGetRecommendationsRef = useCallback(async () => {
    if (enabled && donateOnRecommendations) {
      await donateGetRecommendations();
    }
  }, [enabled, donateOnRecommendations]);

  const donatePlayPlaylistRef = useCallback(async (playlistName: string) => {
    if (enabled && donateOnPlaylist) {
      await donatePlayPlaylist(playlistName);
    }
  }, [enabled, donateOnPlaylist]);

  return {
    donatePlayTrack: donatePlayTrackRef,
    donateGetRecommendations: donateGetRecommendationsRef,
    donatePlayPlaylist: donatePlayPlaylistRef,
  };
}
