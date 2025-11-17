/**
 * Complete Example: Music App with Siri Integration
 * 
 * Shows how to integrate Siri voice commands with a music player
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSiriShortcuts } from '../hooks/useSiriShortcuts';
import { useItem2VecIOS } from '../hooks/useItem2Vec.ios';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

export default function SiriMusicApp() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendations, setRecommendations] = useState<Track[]>([]);

  // Item2Vec for recommendations
  const { getSimilar, train } = useItem2VecIOS({
    autoLoad: true,
    autoSave: true,
  });

  // Siri Shortcuts integration
  const {
    donatePlayTrack,
    donateGetRecommendations,
    donatePlaySimilar,
    presentAddToSiri,
  } = useSiriShortcuts({
    // Handle "Play Track" from Siri
    onPlayTrack: async (trackName, artist) => {
      console.log(`🎤 Siri: Play ${trackName} by ${artist}`);
      
      // Search for track
      const track = await searchTrack(trackName, artist);
      
      if (track) {
        playTrack(track);
        Alert.alert('Now Playing', `${track.title} by ${track.artist}`);
      } else {
        Alert.alert('Not Found', `Could not find ${trackName}`);
      }
    },

    // Handle "Get Recommendations" from Siri
    onGetRecommendations: async (count = 10) => {
      console.log(`🎤 Siri: Get ${count} recommendations`);
      
      if (currentTrack) {
        const similar = getSimilar(currentTrack.id, count);
        const tracks = await fetchTrackDetails(similar.map(s => s.id));
        setRecommendations(tracks);
        Alert.alert('Recommendations', `Found ${tracks.length} songs for you`);
      } else {
        Alert.alert('No Track Playing', 'Play a song first to get recommendations');
      }
    },

    // Handle "Play Similar" from Siri
    onPlaySimilar: async (trackName) => {
      console.log(`🎤 Siri: Play similar to ${trackName}`);
      
      const track = await searchTrack(trackName);
      if (track) {
        const similar = getSimilar(track.id, 10);
        const tracks = await fetchTrackDetails(similar.map(s => s.id));
        
        if (tracks.length > 0) {
          playTrack(tracks[0]);
          setRecommendations(tracks);
          Alert.alert('Playing Similar', `Found ${tracks.length} similar songs`);
        }
      }
    },
  });

  // Play a track
  const playTrack = async (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Donate to Siri (makes it available for voice commands)
    await donatePlayTrack(track.title, track.artist);
    
    console.log(`▶️ Playing: ${track.title} by ${track.artist}`);
  };

  // Get recommendations
  const getRecommendations = async () => {
    if (!currentTrack) {
      Alert.alert('No Track Playing', 'Play a song first');
      return;
    }

    const similar = getSimilar(currentTrack.id, 10);
    const tracks = await fetchTrackDetails(similar.map(s => s.id));
    setRecommendations(tracks);

    // Donate to Siri
    await donateGetRecommendations();
  };

  // Play similar tracks
  const playSimilar = async () => {
    if (!currentTrack) {
      Alert.alert('No Track Playing', 'Play a song first');
      return;
    }

    const similar = getSimilar(currentTrack.id, 10);
    const tracks = await fetchTrackDetails(similar.map(s => s.id));
    
    if (tracks.length > 0) {
      playTrack(tracks[0]);
      setRecommendations(tracks);
      
      // Donate to Siri
      await donatePlaySimilar(currentTrack.title);
    }
  };

  // Add current track to Siri
  const addToSiri = async () => {
    if (!currentTrack) {
      Alert.alert('No Track Playing', 'Play a song first');
      return;
    }

    await presentAddToSiri(
      'com.youtify.playTrack',
      `Play ${currentTrack.title}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Now Playing */}
      <View style={styles.nowPlaying}>
        <Text style={styles.title}>Now Playing</Text>
        {currentTrack ? (
          <>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            <Text style={styles.status}>{isPlaying ? '▶️ Playing' : '⏸ Paused'}</Text>
          </>
        ) : (
          <Text style={styles.noTrack}>No track playing</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          title="Get Recommendations"
          onPress={getRecommendations}
          disabled={!currentTrack}
        />
        <Button
          title="Play Similar"
          onPress={playSimilar}
          disabled={!currentTrack}
        />
        <Button
          title="Add to Siri"
          onPress={addToSiri}
          disabled={!currentTrack}
        />
      </View>

      {/* Recommendations */}
      <View style={styles.recommendations}>
        <Text style={styles.title}>Recommendations</Text>
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.trackItem}
              onPress={() => playTrack(item)}
            >
              <Text style={styles.trackItemTitle}>{item.title}</Text>
              <Text style={styles.trackItemArtist}>{item.artist}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No recommendations yet</Text>
          }
        />
      </View>

      {/* Siri Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Try saying:</Text>
        <Text style={styles.instructionsText}>
          "Hey Siri, play Shape of You in Youtify"
        </Text>
        <Text style={styles.instructionsText}>
          "Hey Siri, get my music recommendations in Youtify"
        </Text>
        <Text style={styles.instructionsText}>
          "Hey Siri, play songs like Blinding Lights in Youtify"
        </Text>
      </View>
    </View>
  );
}

// Mock functions (replace with real implementations)
async function searchTrack(trackName: string, artist?: string): Promise<Track | null> {
  // Simulate API call
  return {
    id: '1',
    title: trackName,
    artist: artist || 'Unknown Artist',
    duration: 180,
  };
}

async function fetchTrackDetails(trackIds: string[]): Promise<Track[]> {
  // Simulate API call
  return trackIds.map((id, index) => ({
    id,
    title: `Track ${index + 1}`,
    artist: `Artist ${index + 1}`,
    duration: 180,
  }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  nowPlaying: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  status: {
    fontSize: 16,
    marginTop: 10,
    color: '#007AFF',
  },
  noTrack: {
    fontSize: 16,
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  recommendations: {
    flex: 1,
  },
  trackItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trackItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  trackItemArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  instructions: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
