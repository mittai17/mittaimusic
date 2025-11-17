import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import {
  initPlayer,
  initAuth,
  initMockData,
  initializeRecommendations,
  startAutoSave,
  trackSongPlay,
  trackSongEnd,
} from '@youtify/services';
import { PlayerMiniBar } from '@youtify/ui';
import { getState, subscribe } from '@youtify/services';

// Import screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import PlayerScreen from './screens/PlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import SplashScreen from './screens/SplashScreen';
import LoadingScreen from './screens/LoadingScreen';
import LyricsScreen from './screens/LyricsScreen';

// Import mock data
import mockData from './assets/mock/data.json';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Playlist" component={PlaylistScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
      <Stack.Screen name="Lyrics" component={LyricsScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="Playlist" component={PlaylistScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
      <Stack.Screen name="Lyrics" component={LyricsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [currentTrack, setCurrentTrack] = React.useState(getState().currentTrack);
  const [isPlaying, setIsPlaying] = React.useState(getState().isPlaying);
  const [showSplash, setShowSplash] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // Initialize services
    const initializeApp = async () => {
      setIsLoading(true);

      // Initialize core services
      initPlayer();
      initAuth();
      initMockData(mockData);

      // Initialize recommendation engine
      initializeRecommendations();

      // Start auto-save for recommendations (every minute)
      const stopAutoSave = startAutoSave(60000);

      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);

      return stopAutoSave;
    };

    if (!showSplash) {
      const cleanup = initializeApp();
      return () => {
        cleanup.then(stop => stop && stop());
      };
    }
  }, [showSplash]);

  useEffect(() => {
    // Subscribe to player state
    const unsubscribe = subscribe((state) => {
      const prevTrack = currentTrack;
      const prevPlaying = isPlaying;

      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.isPlaying);

      // Track song play when a new track starts playing
      if (state.currentTrack && state.isPlaying &&
        (!prevTrack || prevTrack.id !== state.currentTrack.id)) {
        trackSongPlay(state.currentTrack);
      }

      // Track song end when track changes or stops
      if (prevTrack && prevPlaying &&
        (!state.currentTrack || state.currentTrack.id !== prevTrack.id)) {
        // Song was completed if we moved to next track
        const completed = state.currentTrack !== null;
        trackSongEnd(prevTrack.id, completed, !completed);
      }
    });

    return unsubscribe;
  }, [currentTrack, isPlaying]);

  const handlePlayerPress = () => {
    // Navigate to player screen
    // This would be handled by navigation ref in a real app
    console.log('Navigate to player');
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      require('@youtify/services').pause();
    } else {
      require('@youtify/services').resume();
    }
  };

  const handleStartApp = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onStart={handleStartApp} />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <LoadingScreen message="Loading your music..." />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#1db954',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#0a0a0a',
              borderTopColor: '#1a1a1a',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 60,
            },
            headerStyle: {
              backgroundColor: '#0a0a0a',
            },
            headerTintColor: '#fff',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{
              tabBarIcon: ({ color }) => <TabIcon name="search" color={color} />,
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      {currentTrack && (
        <PlayerMiniBar
          track={currentTrack}
          isPlaying={isPlaying}
          onPress={handlePlayerPress}
          onPlayPause={handlePlayPause}
        />
      )}
    </>
  );
}

// Simple tab icon component
function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    home: '🏠',
    search: '🔍',
    settings: '⚙️',
  };
  return <Text style={{ fontSize: 24, color }}>{icons[name] || '•'}</Text>;
}

