import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CoverImage } from './CoverImage';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

interface NowPlayingCardProps {
  track: Track;
  onPress?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}

export const NowPlayingCard: React.FC<NowPlayingCardProps> = ({
  track,
  onPress,
  onLike,
  isLiked = false,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <CoverImage source={{ uri: track.coverUrl }} size={280} style={styles.cover} />
        <View style={styles.info}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
          </View>
          <TouchableOpacity onPress={onLike} style={styles.likeButton}>
            <Text style={styles.likeIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 280,
    borderRadius: 0,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  likeButton: {
    padding: 8,
  },
  likeIcon: {
    fontSize: 24,
  },
});
