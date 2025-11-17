/**
 * Mobile-specific wrapper for Item2Vec
 * Optimized for React Native (iOS & Android)
 * 
 * Features:
 * - AsyncStorage integration
 * - Background training support
 * - Memory management
 * - Network-aware training
 * 
 * Note: Requires @react-native-async-storage/async-storage
 * Install: npm install @react-native-async-storage/async-storage
 */

// @ts-ignore - React Native dependency
import type AsyncStorageType from '@react-native-async-storage/async-storage';

import {
  trainEmbeddings,
  updateEmbeddings,
  getSimilar,
  computeEmbeddingSimilarity,
  serializeEmbeddings,
  deserializeEmbeddings,
  exportEmbeddings,
  importEmbeddings,
  clearEmbeddings,
  getMemoryUsage,
  isTrainingInProgress,
  getConfig,
  batchComputeSimilarity,
} from './item2vec.js';

// Re-export core functions
export {
  getSimilar,
  computeEmbeddingSimilarity,
  clearEmbeddings,
  getMemoryUsage,
  isTrainingInProgress,
  getConfig,
  batchComputeSimilarity,
};

// Storage key for AsyncStorage
const STORAGE_KEY = '@youtify:embeddings';

/**
 * Save embeddings to AsyncStorage (React Native)
 */
export async function saveEmbeddingsToStorage(): Promise<void> {
  try {
    // @ts-ignore - Dynamic import for React Native
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const data = exportEmbeddings();
    await AsyncStorage.default.setItem(STORAGE_KEY, data);
    console.log('✓ Embeddings saved to storage');
  } catch (error) {
    console.error('Failed to save embeddings:', error);
    throw error;
  }
}

/**
 * Load embeddings from AsyncStorage (React Native)
 */
export async function loadEmbeddingsFromStorage(): Promise<boolean> {
  try {
    // @ts-ignore - Dynamic import for React Native
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const data = await AsyncStorage.default.getItem(STORAGE_KEY);
    
    if (data) {
      importEmbeddings(data);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to load embeddings:', error);
    return false;
  }
}

/**
 * Train embeddings with automatic storage (mobile-optimized)
 */
export async function trainAndSave(
  sessions: any[],
  onProgress?: (progress: any) => void
): Promise<void> {
  // Use mobile optimization by default
  await trainEmbeddings(sessions, { useMobileOptimization: true }, onProgress);
  await saveEmbeddingsToStorage();
}

/**
 * Incremental update with storage
 */
export async function updateAndSave(
  newSessions: any[],
  iterations: number = 5
): Promise<void> {
  await updateEmbeddings(newSessions, iterations);
  await saveEmbeddingsToStorage();
}

/**
 * Check if device has enough memory for training
 */
export function hasEnoughMemory(trackCount: number): boolean {
  const estimatedMB = (trackCount * 12 * 8) / (1024 * 1024); // 12-dim embeddings
  const threshold = 50; // 50MB threshold
  return estimatedMB < threshold;
}

/**
 * Get recommended training configuration for current device
 */
export function getRecommendedConfig(trackCount: number): any {
  if (trackCount < 100) {
    return { embeddingDim: 16, epochs: 50, batchSize: 50 };
  } else if (trackCount < 500) {
    return { embeddingDim: 12, epochs: 30, batchSize: 50 };
  } else {
    return { embeddingDim: 8, epochs: 20, batchSize: 100 };
  }
}

/**
 * Clear storage
 */
export async function clearStorage(): Promise<void> {
  try {
    // @ts-ignore - Dynamic import for React Native
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.removeItem(STORAGE_KEY);
    clearEmbeddings();
    console.log('✓ Storage cleared');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
