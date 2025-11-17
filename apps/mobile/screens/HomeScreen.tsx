import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  getHomeData, 
  type HomeData, 
  play, 
  getState,
  getPersonalizedRecommendations,
  trackSongLike,
  type Track,
} from '@youtify/services';
import { NowPlayingCard, SongListItem, CoverImage } from '@youtify/ui';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTrack] = useState(getState().currentTrack);
  const [recommendations, setRecommendations] = useState<Track[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const homeData = await getHomeData();
      setData(homeData);
      
      // Get personalized recommendations
      const personalizedRecs = getPersonalizedRecommendations(8);
      setRecommendations(personalizedRecs);
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Youtify</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Now Playing Card */}
      {currentTrack && (
        <NowPlayingCard
          track={currentTrack}
          onPress={() => (navigation as any).navigate('Player')}
          onLike={() => trackSongLike(currentTrack.id)}
        />
      )}

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
          </View>
          {recommendations.map((track) => (
            <SongListItem
              key={track.id}
              track={track}
              onPress={() => {
                play(track);
                (navigation as any).navigate('Player');
              }}
              isPlaying={currentTrack?.id === track.id}
            />
          ))}
        </View>
      )}

      {/* Top Songs */}
      {data.recommendedTracks.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Songs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {data.recommendedTracks.slice(0, 5).map((track) => (
            <SongListItem
              key={track.id}
              track={track}
              onPress={() => {
                play(track);
                (navigation as any).navigate('Player');
              }}
              isPlaying={currentTrack?.id === track.id}
            />
          ))}
        </View>
      )}

      {/* Trending Playlists */}
      {data.trendingPlaylists.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Playlists</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.trendingPlaylists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                onPress={() => (navigation as any).navigate('Playlist', { id: playlist.id })}
                style={styles.playlistCard}
              >
                <CoverImage source={{ uri: playlist.coverUrl }} size={160} />
                <Text style={styles.cardTitle}>{playlist.name}</Text>
                <Text style={styles.cardSubtitle}>{playlist.tracks.length} tracks</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Genres */}
      {data.genres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Genre</Text>
          <View style={styles.genreGrid}>
            {data.genres.map((genre) => (
              <TouchableOpacity key={genre.id} style={styles.genreCard}>
                <CoverImage source={{ uri: genre.coverUrl }} size={100} />
                <Text style={styles.genreName}>{genre.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1db954',
  },
  profileBtn: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 24,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAll: {
    fontSize: 14,
    color: '#1db954',
    fontWeight: '600',
  },
  playlistCard: {
    marginRight: 16,
    width: 160,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#b3b3b3',
    marginTop: 4,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    width: '30%',
    alignItems: 'center',
  },
  genreName: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
});

