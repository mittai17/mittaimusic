import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  getState,
  subscribe,
  play,
  pause,
  resume,
  next,
  previous,
  type Track,
  getSimilarTracks,
  trackSongLike,
  trackSongDislike,
} from '@youtify/services';
import { CoverImage, CircularProgress } from '@youtify/ui';

export default function PlayerScreen() {
  const navigation = useNavigation();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [similarTracks, setSimilarTracks] = useState<Track[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.isPlaying);
      setPosition(state.position);
      setQueue(state.queue);
    });

    const state = getState();
    setCurrentTrack(state.currentTrack);
    setIsPlaying(state.isPlaying);
    setPosition(state.position);
    setQueue(state.queue);

    if (currentTrack) {
      setDuration(currentTrack.duration);
      
      // Get similar tracks for recommendations
      const similar = getSimilarTracks(currentTrack.id, 5);
      setSimilarTracks(similar);
    }

    return unsubscribe;
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

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No track playing</Text>
      </View>
    );
  }

  const progress = duration > 0 ? position / duration : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>↓</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.circularPlayerContainer}>
        <CircularProgress
          size={280}
          strokeWidth={6}
          progress={progress}
          color="#1db954"
          backgroundColor="#1a1a1a"
        >
          <CoverImage source={{ uri: currentTrack.coverUrl }} size={240} rounded />
        </CircularProgress>
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
      </View>

      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.controlBtn} onPress={previous}>
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={next}>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => (navigation as any).navigate('Lyrics')}
        >
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>Lyrics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={handleLike}
        >
          <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🔀</Text>
          <Text style={styles.actionText}>Shuffle</Text>
        </TouchableOpacity>
      </View>

      {/* Similar Tracks Section */}
      {similarTracks.length > 0 && (
        <View style={styles.nextSongSection}>
          <Text style={styles.nextSongLabel}>Similar Songs</Text>
          {similarTracks.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={styles.nextSongItem}
              onPress={() => play(track)}
            >
              <CoverImage source={{ uri: track.coverUrl }} size={48} />
              <View style={styles.nextSongInfo}>
                <Text style={styles.nextSongTitle} numberOfLines={1}>{track.title}</Text>
                <Text style={styles.nextSongArtist} numberOfLines={1}>{track.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.nextSongSection}>
        <Text style={styles.nextSongLabel}>Next Songs</Text>
        {queue.slice(0, 3).map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.nextSongItem}
            onPress={() => play(track)}
          >
            <CoverImage source={{ uri: track.coverUrl }} size={48} />
            <View style={styles.nextSongInfo}>
              <Text style={styles.nextSongTitle} numberOfLines={1}>{track.title}</Text>
              <Text style={styles.nextSongArtist} numberOfLines={1}>{track.artist}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
  },
  empty: {
    color: '#b3b3b3',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  circularPlayerContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  trackInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  trackTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 18,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  timeText: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginVertical: 24,
  },
  controlBtn: {
    padding: 12,
  },
  controlIcon: {
    fontSize: 32,
    color: '#ffffff',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1db954',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1db954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    fontSize: 32,
    color: '#ffffff',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginVertical: 24,
  },
  actionBtn: {
    alignItems: 'center',
    padding: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  nextSongSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  nextSongLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  nextSongItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
  },
  nextSongInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nextSongTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  nextSongArtist: {
    fontSize: 12,
    color: '#b3b3b3',
  },
});

