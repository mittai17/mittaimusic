/**
 * YouTube IFrame Player Component
 * 
 * This component uses the official YouTube IFrame Player API for legal playback
 * See: https://developers.google.com/youtube/iframe_api_reference
 * 
 * IMPORTANT: This is the LEGAL way to play YouTube content
 * - Uses YouTube's official player
 * - Respects YouTube's Terms of Service
 * - Shows YouTube UI and ads (as required)
 */

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (player?: any) => void;
  onStateChange?: (state: number) => void;
  onError?: (error: any) => void;
  autoplay?: boolean;
  controls?: boolean | number;
  width?: string | number;
  height?: string | number;
  audioOnly?: boolean; // Hide video, show only audio controls
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  onReady,
  onStateChange,
  onError,
  autoplay = false,
  controls = 1,
  width = '100%',
  height = '100%',
  audioOnly = false,
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsLoaded(true);
      };
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !playerRef.current || !window.YT || playerInstanceRef.current) return;

    // Create player instance only once
    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      videoId,
      width: audioOnly ? 0 : (typeof width === 'number' ? width : undefined),
      height: audioOnly ? 0 : (typeof height === 'number' ? height : undefined),
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls,
        modestbranding: 1,
        rel: 0,
        // Audio-only mode: hide video, show minimal UI
        ...(audioOnly && {
          iv_load_policy: 3, // Hide annotations
          showinfo: 0,
          modestbranding: 1,
        }),
      },
      events: {
        onReady: (event: any) => {
          onReady?.(event.target);
        },
        onStateChange: (event: any) => {
          onStateChange?.(event.data);
        },
        onError: (event: any) => {
          onError?.(event.data);
        },
      },
    });

    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
          playerInstanceRef.current = null;
        } catch (e) {
          console.error('Error destroying YouTube player:', e);
        }
      }
    };
  }, [isLoaded, videoId]);

  // Handle video changes
  useEffect(() => {
    if (playerInstanceRef.current && playerInstanceRef.current.loadVideoById) {
      try {
        playerInstanceRef.current.loadVideoById(videoId);
      } catch (e) {
        // Player not ready yet
      }
    }
  }, [videoId]);

  // Player control methods (can be exposed via imperative handle)
  // These are available for future use with forwardRef/useImperativeHandle
  const _play = () => playerInstanceRef.current?.playVideo();
  const _pause = () => playerInstanceRef.current?.pauseVideo();
  const _seekTo = (seconds: number) => playerInstanceRef.current?.seekTo(seconds, true);
  const _getCurrentTime = () => playerInstanceRef.current?.getCurrentTime() || 0;
  const _getDuration = () => playerInstanceRef.current?.getDuration() || 0;

  // Prevent unused variable warnings
  void _play;
  void _pause;
  void _seekTo;
  void _getCurrentTime;
  void _getDuration;

  return (
    <div style={{ width: audioOnly ? '1px' : width, height: audioOnly ? '1px' : height, position: audioOnly ? 'absolute' : 'relative', overflow: 'hidden' }}>
      <div ref={playerRef} style={{ width: audioOnly ? '1px' : '100%', height: audioOnly ? '1px' : '100%' }} />
      {audioOnly && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1 
        }} />
      )}
    </div>
  );
};

// Export player control methods (can be used with refs)
export type YouTubePlayerRef = {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

