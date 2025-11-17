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
  pause,
  resume,
  next,
  previous,
  type Track,
} from '@youtify/services';

// Mock lyrics data - in a real app, this would come from an API
const getLyrics = (_trackId: string): string[] => {
  return [
    'Lorem ipsum dolor sit amet',
    'Consectetur adipiscing elit',
    'Sed do eiusmod tempor incididunt',
    'Ut labore et dolore magna aliqua',
    '',
    'It Ain\'t A Question, But I Got',
    'The Answers Too',
    '',
    'If You Wanna Be Lonely Do',
    'What You Wanna Do',
    '',
    'I\'m In The Fast Lane',
    'From L.A. To Tokyo',
    '',
    'If You Wanna Play It Cool',
    'Do What You Wanna Do',
    '',
    'Oh I Can\'t Take It No More',
    'Baby I\'m Losing My Mind',
    '',
    'Go Ahead And Rock And Roll',
    'If You Wanna Lose Control',
    '',
    'Go Ahead And Do Your Thing',
    'And I\'ll See You When I See You',
    '',
    'And The Answers Too',
  ];
};

export default function LyricsScreen() {
  const navigation = useNavigation();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.isPlaying);
    });

    const state = getState();
    setCurrentTrack(state.currentTrack);
    setIsPlaying(state.isPlaying);

    if (state.currentTrack) {
      setLyrics(getLyrics(state.currentTrack.id));
    }

    return unsubscribe;
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No track playing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.headerArtist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.lyricsContainer}
        contentContainerStyle={styles.lyricsContent}
        showsVerticalScrollIndicator={false}
      >
        {lyrics.map((line, index) => (
          <Text key={index} style={styles.lyricLine}>
            {line || ' '}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.controls}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  headerArtist: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  lyricsContainer: {
    flex: 1,
  },
  lyricsContent: {
    padding: 24,
    paddingBottom: 120,
  },
  lyricLine: {
    fontSize: 18,
    lineHeight: 32,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  empty: {
    color: '#b3b3b3',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 64,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    padding: 24,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  controlBtn: {
    padding: 12,
  },
  controlIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1db954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
});
