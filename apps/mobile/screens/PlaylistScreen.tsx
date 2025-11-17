import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPlaylist, type Playlist } from '@youtify/services';
import { CoverImage, Button } from '@youtify/ui';

export default function PlaylistScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = (route.params as { id?: string }) || {};
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPlaylist(id).then((playlistData) => {
        setPlaylist(playlistData);
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = async () => {
    if (playlist) {
      try {
        await Share.share({
          message: `${playlist.name}\n${playlist.description || ''}`,
          title: playlist.name,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Playlist not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <CoverImage source={{ uri: playlist.coverUrl }} size={240} />
        <Text style={styles.title}>{playlist.name}</Text>
        {playlist.description && (
          <Text style={styles.description}>{playlist.description}</Text>
        )}
        <Text style={styles.meta}>{playlist.tracks.length} tracks</Text>
        <View style={styles.actions}>
          <Button
            title="Play"
            variant="primary"
            onPress={() => {
              if (playlist.tracks.length > 0) {
                require('@youtify/services').play(playlist.tracks[0]);
                navigation.navigate('Player' as never);
              }
            }}
          />
          <Button title="Share" variant="secondary" onPress={handleShare} />
        </View>
      </View>

      <View style={styles.trackList}>
        {playlist.tracks.map((track, index) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackItem}
            onPress={() => {
              require('@youtify/services').play(track);
              navigation.navigate('Player' as never);
            }}
          >
            <Text style={styles.trackNumber}>{index + 1}</Text>
            <CoverImage source={{ uri: track.coverUrl }} size={56} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackArtist}>{track.artist}</Text>
            </View>
            <Text style={styles.trackDuration}>
              {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  trackList: {
    marginTop: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 8,
  },
  trackNumber: {
    width: 24,
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  trackDuration: {
    color: '#888',
    fontSize: 14,
  },
  error: {
    color: '#b3b3b3',
    textAlign: 'center',
    marginTop: 64,
  },
});

