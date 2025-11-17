import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CoverImage } from './CoverImage';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration?: number;
}

interface SongListItemProps {
  track: Track;
  onPress?: () => void;
  isPlaying?: boolean;
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const SongListItem: React.FC<SongListItemProps> = ({
  track,
  onPress,
  isPlaying = false,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isPlaying && styles.containerActive]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CoverImage source={{ uri: track.coverUrl }} size={56} />
      <View style={styles.info}>
        <Text style={[styles.title, isPlaying && styles.titleActive]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
      <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
  },
  containerActive: {
    backgroundColor: '#1db95420',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  titleActive: {
    color: '#1db954',
  },
  artist: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  duration: {
    fontSize: 14,
    color: '#b3b3b3',
  },
});
