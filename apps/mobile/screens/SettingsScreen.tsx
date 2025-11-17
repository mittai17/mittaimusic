import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { getCurrentUser, signOut } from '@youtify/services';
import { Button } from '@youtify/ui';

export default function SettingsScreen() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    // Load theme from storage
    require('@youtify/services').storage.getItem('theme').then((saved: string | null) => {
      if (saved) {
        setTheme(saved as 'light' | 'dark');
      }
    });
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    require('@youtify/services').storage.setItem('theme', newTheme);
    Alert.alert('Theme', `Switched to ${newTheme} mode`);
  };

  const handleBackup = async () => {
    Alert.alert('Backup', 'Backup functionality not yet implemented');
  };

  const handleRestore = async () => {
    Alert.alert('Restore', 'Restore functionality not yet implemented');
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    Alert.alert('Signed Out', 'You have been signed out');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleThemeToggle}>
          <View>
            <Text style={styles.settingTitle}>Theme</Text>
            <Text style={styles.settingSubtitle}>Switch between light and dark mode</Text>
          </View>
          <Text style={styles.toggle}>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleBackup}>
          <View>
            <Text style={styles.settingTitle}>Backup</Text>
            <Text style={styles.settingSubtitle}>Backup your playlists and preferences</Text>
          </View>
          <Button title="Backup" variant="secondary" onPress={handleBackup} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleRestore}>
          <View>
            <Text style={styles.settingTitle}>Restore</Text>
            <Text style={styles.settingSubtitle}>Restore from a previous backup</Text>
          </View>
          <Button title="Restore" variant="secondary" onPress={handleRestore} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user ? (
          <>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Signed in as</Text>
                <Text style={styles.settingSubtitle}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Subscription</Text>
                <Text style={styles.settingSubtitle}>Current tier: {user.subscriptionTier || 'free'}</Text>
              </View>
              <Button
                title="Upgrade"
                variant="primary"
                onPress={() => Alert.alert('Upgrade', 'Subscription upgrade not yet implemented')}
              />
            </View>
            <View style={styles.settingItem}>
              <Button title="Sign Out" variant="ghost" onPress={handleSignOut} />
            </View>
          </>
        ) : (
          <View style={styles.settingItem}>
            <Button
              title="Sign In"
              variant="primary"
              onPress={() => Alert.alert('Sign In', 'Sign in not yet implemented')}
            />
          </View>
        )}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  toggle: {
    padding: 8,
    backgroundColor: '#1db954',
    borderRadius: 8,
    color: '#ffffff',
    fontSize: 14,
  },
});

