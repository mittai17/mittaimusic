import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        <Text style={styles.title}>Youtify</Text>
        <Text style={styles.subtitle}>Your music, your way</Text>
      </Animated.View>

      <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
        <Text style={styles.startButtonText}>Tap to start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    marginBottom: 80,
  },
  iconContainer: {
    marginBottom: 40,
  },
  playButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1db954',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1db954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  playIcon: {
    fontSize: 48,
    color: '#ffffff',
    marginLeft: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#b3b3b3',
  },
  startButton: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#1db954',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1db954',
  },
});
