/**
 * Siri Shortcuts Module for React Native
 * 
 * Allows React Native to interact with Siri Shortcuts
 * and handle voice commands from outside the app
 * 
 * Note: Requires React Native
 */

// @ts-ignore - React Native dependency
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { SiriShortcuts } = NativeModules;
const siriEventEmitter = new NativeEventEmitter(SiriShortcuts);

export interface ShortcutOptions {
  activityType: string;
  title: string;
  userInfo?: Record<string, any>;
  keywords?: string[];
  persistentIdentifier?: string;
  isEligibleForSearch?: boolean;
  isEligibleForPrediction?: boolean;
  suggestedInvocationPhrase?: string;
}

export interface SiriCommand {
  type: 'playTrack' | 'getRecommendations' | 'playPlaylist' | 'searchMusic' | 'playSimilar';
  data: any;
}

class SiriShortcutsManager {
  private listeners: Map<string, (command: SiriCommand) => void> = new Map();

  constructor() {
    if (Platform.OS !== 'ios') {
      console.warn('Siri Shortcuts are only available on iOS');
      return;
    }

    // Listen for Siri commands
    siriEventEmitter.addListener('onSiriCommand', (command: SiriCommand) => {
      this.handleSiriCommand(command);
    });
  }

  /**
   * Donate a shortcut to Siri
   * This makes the action available for Siri suggestions
   */
  async donateShortcut(options: ShortcutOptions): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
      await SiriShortcuts.donateShortcut(options);
      console.log('✓ Shortcut donated:', options.title);
    } catch (error) {
      console.error('Failed to donate shortcut:', error);
    }
  }

  /**
   * Present the "Add to Siri" UI
   */
  async presentShortcut(options: ShortcutOptions): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
      await SiriShortcuts.presentShortcut(options);
    } catch (error) {
      console.error('Failed to present shortcut:', error);
    }
  }

  /**
   * Delete a shortcut
   */
  async deleteShortcut(identifier: string): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
      await SiriShortcuts.deleteShortcut(identifier);
      console.log('✓ Shortcut deleted:', identifier);
    } catch (error) {
      console.error('Failed to delete shortcut:', error);
    }
  }

  /**
   * Get all donated shortcuts
   */
  async getAllShortcuts(): Promise<ShortcutOptions[]> {
    if (Platform.OS !== 'ios') return [];

    try {
      return await SiriShortcuts.getAllShortcuts();
    } catch (error) {
      console.error('Failed to get shortcuts:', error);
      return [];
    }
  }

  /**
   * Register a listener for Siri commands
   */
  onSiriCommand(type: string, callback: (command: SiriCommand) => void): () => void {
    this.listeners.set(type, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(type);
    };
  }

  /**
   * Handle incoming Siri command
   */
  private handleSiriCommand(command: SiriCommand): void {
    console.log('Siri command received:', command);

    const listener = this.listeners.get(command.type);
    if (listener) {
      listener(command);
    } else {
      console.warn('No listener registered for command type:', command.type);
    }
  }

  /**
   * Donate "Play Track" shortcut
   */
  async donatePlayTrack(trackName: string, artist: string): Promise<void> {
    await this.donateShortcut({
      activityType: 'com.youtify.playTrack',
      title: `Play ${trackName}`,
      userInfo: { trackName, artist },
      keywords: ['play', 'music', trackName, artist],
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
      suggestedInvocationPhrase: `Play ${trackName}`,
    });
  }

  /**
   * Donate "Get Recommendations" shortcut
   */
  async donateGetRecommendations(): Promise<void> {
    await this.donateShortcut({
      activityType: 'com.youtify.getRecommendations',
      title: 'Get Music Recommendations',
      keywords: ['recommendations', 'music', 'discover'],
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
      suggestedInvocationPhrase: 'Get my music recommendations',
    });
  }

  /**
   * Donate "Play Playlist" shortcut
   */
  async donatePlayPlaylist(playlistName: string): Promise<void> {
    await this.donateShortcut({
      activityType: 'com.youtify.playPlaylist',
      title: `Play ${playlistName}`,
      userInfo: { playlistName },
      keywords: ['play', 'playlist', playlistName],
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
      suggestedInvocationPhrase: `Play ${playlistName} playlist`,
    });
  }

  /**
   * Donate "Play Similar" shortcut
   */
  async donatePlaySimilar(trackName: string): Promise<void> {
    await this.donateShortcut({
      activityType: 'com.youtify.playSimilar',
      title: `Play songs like ${trackName}`,
      userInfo: { trackName },
      keywords: ['similar', 'like', trackName],
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
      suggestedInvocationPhrase: `Play songs like ${trackName}`,
    });
  }
}

export const SiriShortcutsAPI = new SiriShortcutsManager();

// Convenience functions
export const donatePlayTrack = (trackName: string, artist: string) =>
  SiriShortcutsAPI.donatePlayTrack(trackName, artist);

export const donateGetRecommendations = () =>
  SiriShortcutsAPI.donateGetRecommendations();

export const donatePlayPlaylist = (playlistName: string) =>
  SiriShortcutsAPI.donatePlayPlaylist(playlistName);

export const donatePlaySimilar = (trackName: string) =>
  SiriShortcutsAPI.donatePlaySimilar(trackName);

export const onSiriCommand = (type: string, callback: (command: SiriCommand) => void) =>
  SiriShortcutsAPI.onSiriCommand(type, callback);
