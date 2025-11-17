/**
 * Complete Example: Music Player with Auto Queue
 * 
 * Demonstrates automatic queue management with Item2Vec recommendations
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAutoQueue, useQueuePersistence } from '../hooks/useAutoQueue';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
}

export default function AutoQueueMusicPlayer() {
  const {
    queue,
    currentTrack,
    queueSize,
    needsRefill,
    isPlaying,
    playNext,
    playTrack,
    addToQueue,
    removeFromQueue,
    clearQueue,
    refillQueue,
    smartRefill,
    stats,
  } = useAutoQueue({
    minQueueSize: 5,
    maxQueueSize: 20,
    autoRefill: true,
    similarityThreshold: 0.3,
    diversityFactor: 0.2,
  });

  const { saveQueue, loadQueue } = useQueuePersistence();

  // Load saved queue on mount
  useEffect(() => {
    loadQueue();
  }, []);

  // Save queue when it changes
  useEffect(() => {
    if (queue.length > 0) {
      saveQueue();
    }
  }, [queue]);

  // Handle track end (simulate)
  const handleTrackEnd = () => {
    console.log('Track ended, playing next...');
    playNext();
  };

  // Play a sample track
  const playSampleTrack = async () => {
    const sampleTrack: Track = {
      id: 'track_001',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      genre: 'Pop',
      duration: 234,
    };

    await playTrack(sampleTrack);
  };

  // Handle manual refill
  const handleRefill = async () => {
    if (!currentTrack) {
      Alert.alert('No Track Playing', 'Play a track first');
      return;
    }

    await refillQueue();
    Alert.alert('Queue Refilled', `Added tracks to queue`);
  };

  // Handle smart refill
  const handleSmartRefill = async () => {
    await smartRefill();
    Alert.alert('Smart Refill', 'Added personalized tracks to queue');
  };

  return (
    <View style={styles.container}>
      {/* Now Playing */}
      <View style={styles.nowPlaying}>
        <Text style={styles.sectionTitle}>Now Playing</Text>
        {currentTrack ? (
          <>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            <Text style={styles.trackGenre}>{currentTrack.genre}</Text>
            <Text style={styles.status}>
              {isPlaying ? '▶️ Playing' : '⏸ Paused'}
            </Text>
          </>
        ) : (
          <Text style={styles.noTrack}>No track playing</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          title="Play Sample"
          onPress={playSampleTrack}
        />
        <Button
          title="Next Track"
          onPress={playNext}
          disabled={queueSize === 0}
        />
        <Button
          title="Track Ended"
          onPress={handleTrackEnd}
          disabled={!currentTrack}
        />
      </View>

      {/* Queue Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>Queue Statistics</Text>
        <Text style={styles.statsText}>Queue Size: {stats.queueSize}</Text>
        <Text style={styles.statsText}>History: {stats.historySize} tracks</Text>
        <Text style={styles.statsText}>
          Needs Refill: {stats.needsRefill ? '⚠️ Yes' : '✅ No'}
        </Text>
        <Text style={styles.statsText}>
          Avg Similarity: {(stats.averageSimilarity * 100).toFixed(1)}%
        </Text>
      </View>

      {/* Queue Management */}
      <View style={styles.queueManagement}>
        <Button
          title="Refill Queue"
          onPress={handleRefill}
          disabled={!currentTrack}
        />
        <Button
          title="Smart Refill"
          onPress={handleSmartRefill}
        />
        <Button
          title="Clear Queue"
          onPress={clearQueue}
          color="red"
        />
      </View>

      {/* Up Next Queue */}
      <View style={styles.queueSection}>
        <Text style={styles.sectionTitle}>
          Up Next ({queueSize} songs)
        </Text>
        
        {queueSize === 0 ? (
          <View style={styles.emptyQueue}>
            <Text style={styles.emptyQueueText}>No songs in queue</Text>
            <Text style={styles.emptyQueueSubtext}>
              {currentTrack 
                ? 'Songs will be added automatically'
                : 'Play a song to start'}
            </Text>
            {needsRefill && currentTrack && (
              <Button
                title="Add Recommendations"
                onPress={handleRefill}
              />
            )}
          </View>
        ) : (
          <FlatList
            data={queue}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.queueItem}>
                <View style={styles.queueItemInfo}>
                  <Text style={styles.queueItemNumber}>{index + 1}</Text>
                  <View style={styles.queueItemDetails}>
                    <Text style={styles.queueItemTitle}>{item.title}</Text>
                    <Text style={styles.queueItemArtist}>{item.artist}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromQueue(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              needsRefill ? (
                <View style={styles.refillPrompt}>
                  <Text style={styles.refillPromptText}>
                    ⚠️ Queue is running low
                  </Text>
                  <Button
                    title="Add More Songs"
                    onPress={handleRefill}
                  />
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How it works:</Text>
        <Text style={styles.instructionsText}>
          1. Play a track to start
        </Text>
        <Text style={styles.instructionsText}>
          2. Queue fills automatically with similar songs
        </Text>
        <Text style={styles.instructionsText}>
          3. Queue refills when running low
        </Text>
        <Text style={styles.instructionsText}>
          4. Uses Item2Vec for smart recommendations
        </Text>
      </View>
    </View>
  );
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
  sectionTitle: {
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
  trackGenre: {
    fontSize: 14,
    color: '#999',
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
  stats: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  queueManagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  queueSection: {
    flex: 1,
  },
  emptyQueue: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQueueText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#999',
    marginBottom: 10,
  },
  emptyQueueSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 20,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  queueItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  queueItemNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginRight: 15,
    width: 30,
  },
  queueItemDetails: {
    flex: 1,
  },
  queueItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  queueItemArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#ff3b30',
  },
  refillPrompt: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    marginTop: 10,
  },
  refillPromptText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 10,
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
