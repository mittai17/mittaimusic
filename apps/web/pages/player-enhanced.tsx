import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  getState,
  subscribe,
  play,
  pause,
  resume,
  seek,
  next,
  previous,
  addToQueue,
  type Track,
  getSimilarTracks,
  trackSongLike,
  trackSongDislike,
} from '@youtify/services';
import { CoverImage, SeekBar } from '@youtify/ui';
import { CircularPlayer } from '../components/CircularPlayer';
import { YouTubePlayer } from '../components/YouTubePlayer';
import { getRelatedVideos, type YouTubeVideo } from '../lib/youtube';
import styles from '../styles/PlayerEnhanced.module.css';

// Helper function to check if content should be blocked
const shouldBlockContent = (title: string, artist: string): boolean => {
  const text = `${title} ${artist}`.toLowerCase();
  
  // Block Ramayana/Mahabharata characters (any language)
  const blockedCharacters = [
    'rama', 'sita', 'seetha', 'lava', 'kusha', 'hanuman', 'ravana',
    'சீதை', 'ராமன்', 'இராமன்', 'லவன்', 'குசன்', 'ஹனுமான்',
    'krishna', 'arjuna', 'கிருஷ்ணா', 'அர்ஜுனன்',
  ];
  
  if (blockedCharacters.some(char => text.includes(char))) return true;
  
  // Block devotional content
  if (text.includes('devotional') || text.includes('பக்தி')) return true;
  
  // Block excessive emojis
  const emojiCount = (title.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 3) return true;
  
  // Block Tamil/regional without music keywords
  const hasTamilScript = /[\u0B80-\u0BFF]/.test(title);
  if (hasTamilScript) {
    const hasMusicKeyword = ['song', 'audio', 'music', 'lyric', 'official'].some(kw => text.includes(kw));
    if (!hasMusicKeyword) return true;
  }
  
  return false;
};

export default function PlayerEnhancedPage() {
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isYouTubeTrack, setIsYouTubeTrack] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  // Volume controls (for future implementation)
  // const [volume, setVolume] = useState(100);
  // const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [suggestions, setSuggestions] = useState<YouTubeVideo[]>([]);
  const [similarTracks, setSimilarTracks] = useState<Track[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [isLiked, setIsLiked] = useState(false);
  const youtubePlayerInstanceRef = useRef<any>(null);
  const positionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsLoadedRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.isPlaying);
      setPosition(state.position);
      
      // Filter queue to remove blocked content
      const filteredQueue = state.queue.filter(track => 
        !shouldBlockContent(track.title, track.artist)
      );
      setQueue(filteredQueue);
    });

    const state = getState();
    setCurrentTrack(state.currentTrack);
    setIsPlaying(state.isPlaying);
    setPosition(state.position);
    
    // Filter initial queue
    const filteredQueue = state.queue.filter(track => 
      !shouldBlockContent(track.title, track.artist)
    );
    setQueue(filteredQueue);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.duration);
      
      if (currentTrack.audioUrl.startsWith('youtube:')) {
        setIsYouTubeTrack(true);
        setYoutubeVideoId(currentTrack.audioUrl.replace('youtube:', ''));
      } else {
        setIsYouTubeTrack(false);
        setYoutubeVideoId(null);
      }
      
      // Get similar tracks
      const similar = getSimilarTracks(currentTrack.id, 5);
      setSimilarTracks(similar);
    }
  }, [currentTrack]);

  const handleLike = () => {
    if (currentTrack) {
      if (isLiked) {
        trackSongDislike(currentTrack.id);
      } else {
        trackSongLike(currentTrack.id);
      }
      setIsLiked(!isLiked);
    }
  };

  useEffect(() => {
    if (isYouTubeTrack && youtubePlayerInstanceRef.current && isPlaying) {
      positionIntervalRef.current = setInterval(() => {
        try {
          const currentTime = youtubePlayerInstanceRef.current.getCurrentTime();
          const videoDuration = youtubePlayerInstanceRef.current.getDuration();
          setPosition(currentTime);
          if (videoDuration && videoDuration !== duration) {
            setDuration(videoDuration);
          }
        } catch (e) {
          // Player not ready
        }
      }, 500);
    } else {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
        positionIntervalRef.current = null;
      }
    }

    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [isYouTubeTrack, isPlaying]);

  const handlePlayPause = () => {
    if (isYouTubeTrack && youtubePlayerInstanceRef.current) {
      if (isPlaying) {
        youtubePlayerInstanceRef.current.pauseVideo();
        pause();
      } else {
        youtubePlayerInstanceRef.current.playVideo();
        resume();
      }
    } else {
      if (isPlaying) {
        pause();
      } else {
        if (currentTrack) {
          resume();
        }
      }
    }
  };

  const handleSeek = (seconds: number) => {
    if (isYouTubeTrack && youtubePlayerInstanceRef.current) {
      youtubePlayerInstanceRef.current.seekTo(seconds, true);
    }
    seek(seconds);
  };

  const handleNext = () => {
    if (repeat === 'one' && youtubePlayerInstanceRef.current) {
      youtubePlayerInstanceRef.current.seekTo(0, true);
      return;
    }
    next();
  };

  const handlePrevious = () => {
    if (position > 3) {
      handleSeek(0);
    } else {
      previous();
    }
  };

  const handleYouTubeReady = useCallback((player: any) => {
    youtubePlayerInstanceRef.current = player;
    if (isPlaying) {
      player.playVideo();
    }
  }, [isPlaying]);

  const handleYouTubeStateChange = useCallback((state: number) => {
    setIsPlaying(state === 1);
    if (state === 0) {
      handleNext();
    }
  }, [repeat]);

  // Fetch suggestions based on current track
  useEffect(() => {
    if (!currentTrack || !isYouTubeTrack) return;
    if (suggestionsLoadedRef.current === currentTrack.id) return;

    const fetchSuggestions = async () => {
      try {
        let results: YouTubeVideo[] = [];
        
        if (youtubeVideoId) {
          try {
            // Get more videos to have better filtering options
            const relatedVideos = await getRelatedVideos(youtubeVideoId, 20);
            results = relatedVideos;
          } catch (error) {
            console.error('Failed to fetch related videos:', error);
          }
        }
        
        // No filtering - show all results
        const filtered = results;
        
        // Prioritize songs from same artist or with similar titles
        const currentArtist = currentTrack.artist.toLowerCase();
        const currentTitle = currentTrack.title.toLowerCase();
        
        const scored = filtered.map((video: YouTubeVideo) => {
          let score = 0;
          const videoChannel = video.channelTitle.toLowerCase();
          const videoTitle = video.title.toLowerCase();
          
          // Same artist/channel = high priority
          if (videoChannel.includes(currentArtist) || currentArtist.includes(videoChannel)) {
            score += 10;
          }
          
          // Similar title words
          const currentWords = currentTitle.split(' ').filter((w: string) => w.length > 3);
          const videoWords = videoTitle.split(' ').filter((w: string) => w.length > 3);
          const commonWords = currentWords.filter((w: string) => videoWords.includes(w));
          score += commonWords.length * 2;
          
          // Prefer official content
          if (videoTitle.includes('official')) score += 3;
          if (videoTitle.includes('audio')) score += 2;
          if (videoTitle.includes('lyric')) score += 1;
          
          return { video, score };
        });
        
        // Sort by score and take top results
        const sortedFiltered = scored
          .sort((a, b) => b.score - a.score)
          .map(item => item.video);
        
        setSuggestions(sortedFiltered.slice(0, 8));
        suggestionsLoadedRef.current = currentTrack.id;
        
        // Auto-add to queue if queue is low
        if (queue.length < 3) {
          // First, try to add similar tracks from recommendation engine
          if (similarTracks.length > 0) {
            similarTracks.slice(0, 3).forEach((track) => {
              addToQueue(track);
            });
          } 
          // If not enough similar tracks, add best-matched YouTube suggestions
          else if (sortedFiltered.length > 0) {
            sortedFiltered.slice(0, 3).forEach((video) => {
              const track: Track = {
                id: video.videoId,
                title: video.title,
                artist: video.channelTitle,
                artistId: `yt-${video.channelTitle}`,
                duration: 0,
                coverUrl: video.thumbnail,
                audioUrl: `youtube:${video.videoId}`,
                genre: 'YouTube',
              };
              addToQueue(track);
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [currentTrack, isYouTubeTrack, youtubeVideoId, queue.length]);

  const handleAddToQueue = (video: YouTubeVideo) => {
    const track: Track = {
      id: video.videoId,
      title: video.title,
      artist: video.channelTitle,
      artistId: `yt-${video.channelTitle}`,
      duration: 0,
      coverUrl: video.thumbnail,
      audioUrl: `youtube:${video.videoId}`,
      genre: 'YouTube',
    };
    addToQueue(track);
  };

  const handlePlayNow = async (video: YouTubeVideo) => {
    const track: Track = {
      id: video.videoId,
      title: video.title,
      artist: video.channelTitle,
      artistId: `yt-${video.channelTitle}`,
      duration: 0,
      coverUrl: video.thumbnail,
      audioUrl: `youtube:${video.videoId}`,
      genre: 'YouTube',
    };
    await play(track);
  };

  const progress = duration > 0 ? position / duration : 0;

  if (!currentTrack) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎵</div>
          <h2>No track playing</h2>
          <p>Search for music to start listening</p>
          <Link href="/search">
            <button className={styles.searchButton}>Search Music</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{currentTrack.title} - Mittai's Music</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.back()}>
            ↓
          </button>
          <h3 className={styles.headerTitle}>Now Playing</h3>
          <button className={styles.moreButton}>⋯</button>
        </div>

        <div className={styles.playerSection}>
          <div className={styles.circularPlayerContainer}>
            <CircularPlayer progress={progress} size={320} strokeWidth={6}>
              {isYouTubeTrack && youtubeVideoId ? (
                <div style={{ position: 'relative', width: 280, height: 280 }}>
                  <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
                    <YouTubePlayer
                      key={youtubeVideoId}
                      videoId={youtubeVideoId}
                      width={280}
                      height={280}
                      autoplay={false}
                      audioOnly={true}
                      onReady={handleYouTubeReady}
                      onStateChange={handleYouTubeStateChange}
                    />
                  </div>
                  <CoverImage 
                    source={{ uri: currentTrack.coverUrl }} 
                    size={280}
                    rounded={true}
                  />
                </div>
              ) : (
                <CoverImage 
                  source={{ uri: currentTrack.coverUrl }} 
                  size={280}
                  rounded={true}
                />
              )}
            </CircularPlayer>
          </div>

          <div className={styles.trackInfo}>
            <h1 className={styles.trackTitle}>{currentTrack.title}</h1>
            <p className={styles.trackArtist}>{currentTrack.artist}</p>
          </div>

          <SeekBar
            currentTime={position}
            duration={duration}
            onSeek={handleSeek}
          />

          <div className={styles.controls}>
            <button 
              className={styles.controlButton}
              onClick={() => setShuffle(!shuffle)}
              style={{ opacity: shuffle ? 1 : 0.5 }}
            >
              🔀
            </button>
            <button className={styles.controlButton} onClick={handlePrevious}>
              ⏮
            </button>
            <button className={styles.playButton} onClick={handlePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className={styles.controlButton} onClick={handleNext}>
              ⏭
            </button>
            <button 
              className={styles.controlButton}
              onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
              style={{ opacity: repeat !== 'off' ? 1 : 0.5 }}
            >
              {repeat === 'one' ? '🔂' : '🔁'}
            </button>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.actionButton}
              onClick={() => setShowLyrics(!showLyrics)}
            >
              <span className={styles.actionIcon}>📝</span>
              <span className={styles.actionText}>Lyrics</span>
            </button>
            <button 
              className={styles.actionButton}
              onClick={handleLike}
            >
              <span className={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</span>
              <span className={styles.actionText}>Like</span>
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => setShuffle(!shuffle)}
              style={{ opacity: shuffle ? 1 : 0.6 }}
            >
              <span className={styles.actionIcon}>🔀</span>
              <span className={styles.actionText}>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Queue Section */}
        <div className={styles.queueSection}>
          <div className={styles.queueHeader}>
            <h3 className={styles.queueTitle}>Up Next</h3>
            <div className={styles.queueActions}>
              {queue.length > 1 && (
                <button 
                  className={styles.viewAllBtn}
                  onClick={() => setShowQueue(!showQueue)}
                >
                  {showQueue ? 'Hide' : `View all (${queue.length - 1})`}
                </button>
              )}
            </div>
          </div>
          
          {queue.length > 1 ? (
            <div className={styles.queueList}>
              {queue
                .filter((track) => track.id !== currentTrack?.id)
                .slice(0, showQueue ? undefined : 3)
                .map((track) => (
                  <div
                    key={track.id}
                    className={styles.queueItem}
                    onClick={() => play(track)}
                  >
                    <img 
                      src={track.coverUrl} 
                      alt={track.title}
                      className={styles.queueThumb}
                    />
                    <div className={styles.queueInfo}>
                      <h4>{track.title}</h4>
                      <p>{track.artist}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className={styles.emptyQueue}>
              <p>No songs in queue</p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>
                Songs will be added automatically
              </p>
              {suggestions.length > 0 && (
                <button 
                  className={styles.addSuggestionsBtn}
                  onClick={() => {
                    suggestions.slice(0, 5).forEach(video => handleAddToQueue(video));
                  }}
                >
                  Add Suggested Songs
                </button>
              )}
            </div>
          )}
        </div>

        {/* Similar Tracks Section */}
        {similarTracks.length > 0 && (
          <div className={styles.suggestionsSection}>
            <h3 className={styles.sectionTitle}>Similar Songs</h3>
            <div className={styles.suggestionsList}>
              {similarTracks.map((track) => (
                <div key={track.id} className={styles.suggestionItem}>
                  <img 
                    src={track.coverUrl} 
                    alt={track.title}
                    className={styles.suggestionThumb}
                  />
                  <div className={styles.suggestionInfo}>
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                  </div>
                  <div className={styles.suggestionActions}>
                    <button 
                      className={styles.playNowBtn}
                      onClick={() => play(track)}
                    >
                      ▶
                    </button>
                    <button 
                      className={styles.addQueueBtn}
                      onClick={() => addToQueue(track)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className={styles.suggestionsSection}>
            <h3 className={styles.sectionTitle}>You Might Also Like</h3>
            <div className={styles.suggestionsList}>
              {suggestions.map((video) => (
                <div key={video.videoId} className={styles.suggestionItem}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className={styles.suggestionThumb}
                  />
                  <div className={styles.suggestionInfo}>
                    <h4>{video.title}</h4>
                    <p>{video.channelTitle}</p>
                  </div>
                  <div className={styles.suggestionActions}>
                    <button 
                      className={styles.playNowBtn}
                      onClick={() => handlePlayNow(video)}
                    >
                      ▶
                    </button>
                    <button 
                      className={styles.addQueueBtn}
                      onClick={() => handleAddToQueue(video)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showLyrics && (
          <div className={styles.lyricsOverlay} onClick={() => setShowLyrics(false)}>
            <div className={styles.lyricsContainer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.lyricsHeader}>
                <button onClick={() => setShowLyrics(false)}>←</button>
                <h3>Lyrics</h3>
              </div>
              <div className={styles.lyricsContent}>
                <p>Lorem ipsum dolor sit amet</p>
                <p>Consectetur adipiscing elit</p>
                <p>Sed do eiusmod tempor incididunt</p>
                <p>Ut labore et dolore magna aliqua</p>
                <p></p>
                <p>It Ain't A Question, But I Got</p>
                <p>The Answers Too</p>
                <p></p>
                <p>If You Wanna Be Lonely Do</p>
                <p>What You Wanna Do</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
