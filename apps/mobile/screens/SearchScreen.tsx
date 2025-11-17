import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { search, type SearchResult } from '@youtify/services';
import { ListItem, CoverImage } from '@youtify/ui';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      search(query).then((searchResults) => {
        setResults(searchResults);
        setLoading(false);
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for songs, artists, playlists..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1db954" />
        </View>
      )}

      {results && (
        <ScrollView style={styles.results}>
          {results.tracks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tracks</Text>
              {results.tracks.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  onPress={() => {
                    require('@youtify/services').play(track);
                    navigation.navigate('Player' as never);
                  }}
                >
                  <ListItem
                    title={track.title}
                    subtitle={track.artist}
                    leftIcon={<CoverImage source={{ uri: track.coverUrl }} size={48} />}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {results.artists.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Artists</Text>
              {results.artists.map((artist) => (
                <TouchableOpacity key={artist.id}>
                  <ListItem
                    title={artist.name}
                    subtitle={`${artist.followers || 0} followers`}
                    leftIcon={<CoverImage source={{ uri: artist.avatarUrl }} size={48} rounded />}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {results.playlists.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Playlists</Text>
              {results.playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  onPress={() => (navigation as any).navigate('Playlist', { id: playlist.id })}
                >
                  <ListItem
                    title={playlist.name}
                    subtitle={`${playlist.tracks.length} tracks`}
                    leftIcon={<CoverImage source={{ uri: playlist.coverUrl }} size={48} />}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!loading && results.tracks.length === 0 && results.artists.length === 0 && results.playlists.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: 16,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  results: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 64,
  },
  noResultsText: {
    fontSize: 18,
    color: '#b3b3b3',
  },
});

