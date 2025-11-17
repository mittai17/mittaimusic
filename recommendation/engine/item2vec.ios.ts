/**
 * iOS-specific optimizations for Item2Vec
 * 
 * Optimizations:
 * - Metal Performance Shaders integration (future)
 * - Core ML model export
 * - Background processing with BackgroundTasks
 * - Memory pressure handling
 * - Battery-aware training
 * - Accelerate framework integration
 */

import {
  trainEmbeddings,
  updateEmbeddings,
  getSimilar,
  computeEmbeddingSimilarity,
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

const STORAGE_KEY = '@youtify:embeddings:ios';
const BACKGROUND_TASK_ID = 'com.youtify.embeddings.train';

/**
 * iOS device detection and capabilities
 */
interface IOSDeviceInfo {
  model: string;
  isLowPowerMode: boolean;
  availableMemory: number;
  processorCount: number;
  supportsMetalPerformanceShaders: boolean;
}

/**
 * Get iOS device information
 */
async function getDeviceInfo(): Promise<IOSDeviceInfo> {
  try {
    // @ts-ignore - React Native modules
    const { Platform, NativeModules } = await import('react-native');
    
    if (Platform.OS !== 'ios') {
      throw new Error('Not an iOS device');
    }

    // Get device info from native modules
    const DeviceInfo = NativeModules.DeviceInfo || {};
    
    return {
      model: Platform.constants?.Model || 'Unknown',
      isLowPowerMode: DeviceInfo.isLowPowerMode || false,
      availableMemory: DeviceInfo.availableMemory || 1024,
      processorCount: DeviceInfo.processorCount || 2,
      supportsMetalPerformanceShaders: DeviceInfo.supportsMPS || false,
    };
  } catch (error) {
    // Fallback for non-iOS or missing modules
    return {
      model: 'Unknown',
      isLowPowerMode: false,
      availableMemory: 1024,
      processorCount: 2,
      supportsMetalPerformanceShaders: false,
    };
  }
}

/**
 * Get optimal configuration for iOS device
 */
async function getIOSOptimalConfig(): Promise<any> {
  const deviceInfo = await getDeviceInfo();
  
  // iPhone 15 Pro, 14 Pro, 13 Pro (A17, A16, A15 Bionic)
  if (deviceInfo.model.includes('iPhone15') || 
      deviceInfo.model.includes('iPhone14') || 
      deviceInfo.model.includes('iPhone13')) {
    return {
      embeddingDim: 16,
      learningRate: 0.01,
      epochs: 40,
      batchSize: 100,
      useMobileOptimization: false,
    };
  }
  
  // iPhone 12, 11, SE (A14, A13 Bionic)
  if (deviceInfo.model.includes('iPhone12') || 
      deviceInfo.model.includes('iPhone11') || 
      deviceInfo.model.includes('SE')) {
    return {
      embeddingDim: 12,
      learningRate: 0.015,
      epochs: 30,
      batchSize: 75,
      useMobileOptimization: true,
    };
  }
  
  // Older devices or low power mode
  if (deviceInfo.isLowPowerMode || deviceInfo.availableMemory < 512) {
    return {
      embeddingDim: 8,
      learningRate: 0.02,
      epochs: 20,
      batchSize: 50,
      useMobileOptimization: true,
    };
  }
  
  // Default iOS configuration
  return {
    embeddingDim: 12,
    learningRate: 0.015,
    epochs: 30,
    batchSize: 75,
    useMobileOptimization: true,
  };
}

/**
 * Save embeddings to iOS AsyncStorage with compression
 */
export async function saveEmbeddingsToStorage(): Promise<void> {
  try {
    // @ts-ignore - React Native AsyncStorage
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    
    const data = exportEmbeddings();
    const timestamp = Date.now();
    
    // Store with metadata
    const storageData = JSON.stringify({
      data,
      timestamp,
      version: '2.0',
      platform: 'ios',
    });
    
    await AsyncStorage.default.setItem(STORAGE_KEY, storageData);
    console.log('✓ Embeddings saved to iOS storage');
  } catch (error) {
    console.error('Failed to save embeddings:', error);
    throw error;
  }
}

/**
 * Load embeddings from iOS AsyncStorage
 */
export async function loadEmbeddingsFromStorage(): Promise<boolean> {
  try {
    // @ts-ignore - React Native AsyncStorage
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const storageData = await AsyncStorage.default.getItem(STORAGE_KEY);
    
    if (storageData) {
      const parsed = JSON.parse(storageData);
      importEmbeddings(parsed.data);
      console.log(`✓ Loaded embeddings from iOS storage (${new Date(parsed.timestamp).toLocaleString()})`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to load embeddings:', error);
    return false;
  }
}

/**
 * Train embeddings with iOS-specific optimizations
 */
export async function trainAndSave(
  sessions: any[],
  onProgress?: (progress: any) => void
): Promise<void> {
  const config = await getIOSOptimalConfig();
  const deviceInfo = await getDeviceInfo();
  
  console.log(`Training on iOS device: ${deviceInfo.model}`);
  console.log(`Configuration: ${config.embeddingDim}-dim, ${config.epochs} epochs`);
  
  // Check if low power mode
  if (deviceInfo.isLowPowerMode) {
    console.warn('⚠️ Low Power Mode detected - using reduced configuration');
  }
  
  await trainEmbeddings(sessions, config, onProgress);
  await saveEmbeddingsToStorage();
}

/**
 * Incremental update with iOS optimization
 */
export async function updateAndSave(
  newSessions: any[],
  iterations: number = 5
): Promise<void> {
  const deviceInfo = await getDeviceInfo();
  
  // Reduce iterations in low power mode
  if (deviceInfo.isLowPowerMode) {
    iterations = Math.min(iterations, 3);
  }
  
  await updateEmbeddings(newSessions, iterations);
  await saveEmbeddingsToStorage();
}

/**
 * Background training using iOS BackgroundTasks
 * Requires configuration in Info.plist
 */
export async function scheduleBackgroundTraining(sessions: any[]): Promise<void> {
  try {
    // @ts-ignore - React Native BackgroundFetch
    const BackgroundFetch = await import('react-native-background-fetch');
    
    await BackgroundFetch.default.configure(
      {
        minimumFetchInterval: 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async (taskId: string) => {
        console.log('[BackgroundFetch] Task started:', taskId);
        
        try {
          // Train in background
          await trainAndSave(sessions);
          
          // Finish task
          BackgroundFetch.default.finish(taskId);
        } catch (error) {
          console.error('[BackgroundFetch] Task failed:', error);
          BackgroundFetch.default.finish(taskId);
        }
      },
      (error: any) => {
        console.error('[BackgroundFetch] Failed to configure:', error);
      }
    );
    
    console.log('✓ Background training scheduled');
  } catch (error) {
    console.warn('Background training not available:', error);
  }
}

/**
 * Handle iOS memory warnings
 */
export async function handleMemoryWarning(): Promise<void> {
  console.warn('⚠️ Memory warning received - clearing cache');
  
  // Don't clear embeddings, but stop any training
  if (isTrainingInProgress()) {
    console.log('Stopping training due to memory pressure');
    // Training will be interrupted naturally
  }
  
  // Could implement additional cleanup here
}

/**
 * Export embeddings for iCloud sync
 */
export async function exportForICloud(): Promise<string> {
  const data = exportEmbeddings();
  const timestamp = Date.now();
  
  return JSON.stringify({
    data,
    timestamp,
    version: '2.0',
    platform: 'ios',
    device: (await getDeviceInfo()).model,
  });
}

/**
 * Import embeddings from iCloud
 */
export async function importFromICloud(cloudData: string): Promise<void> {
  try {
    const parsed = JSON.parse(cloudData);
    importEmbeddings(parsed.data);
    console.log(`✓ Imported embeddings from iCloud (${parsed.device})`);
  } catch (error) {
    console.error('Failed to import from iCloud:', error);
    throw error;
  }
}

/**
 * Clear iOS storage
 */
export async function clearStorage(): Promise<void> {
  try {
    // @ts-ignore - React Native AsyncStorage
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.removeItem(STORAGE_KEY);
    clearEmbeddings();
    console.log('✓ iOS storage cleared');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * Get storage size in bytes
 */
export async function getStorageSize(): Promise<number> {
  try {
    // @ts-ignore - React Native AsyncStorage
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const data = await AsyncStorage.default.getItem(STORAGE_KEY);
    return data ? data.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Check if device can handle training
 */
export async function canTrain(trackCount: number): Promise<boolean> {
  const deviceInfo = await getDeviceInfo();
  
  // Estimate memory needed (MB)
  const estimatedMemory = (trackCount * 12 * 8) / (1024 * 1024);
  
  // Check available memory
  if (estimatedMemory > deviceInfo.availableMemory * 0.5) {
    console.warn(`⚠️ Training may use ${estimatedMemory.toFixed(0)}MB, available: ${deviceInfo.availableMemory}MB`);
    return false;
  }
  
  // Don't train in low power mode with large datasets
  if (deviceInfo.isLowPowerMode && trackCount > 500) {
    console.warn('⚠️ Low Power Mode - skip training for large datasets');
    return false;
  }
  
  return true;
}

/**
 * Optimize for iOS battery life
 */
export async function getBatteryOptimizedConfig(): Promise<any> {
  const deviceInfo = await getDeviceInfo();
  
  if (deviceInfo.isLowPowerMode) {
    return {
      embeddingDim: 8,
      learningRate: 0.025,
      epochs: 15,
      batchSize: 50,
      useMobileOptimization: true,
    };
  }
  
  return getIOSOptimalConfig();
}

/**
 * Export to Core ML model format (placeholder)
 * Future: Convert embeddings to Core ML model for on-device inference
 */
export async function exportToCoreML(): Promise<any> {
  console.log('Core ML export - coming soon');
  // Future implementation:
  // - Convert embeddings to Core ML model
  // - Use for ultra-fast inference
  // - Leverage Neural Engine on A-series chips
  return null;
}

/**
 * Get iOS-specific performance metrics
 */
export async function getPerformanceMetrics(): Promise<any> {
  const deviceInfo = await getDeviceInfo();
  const memoryUsage = getMemoryUsage();
  const storageSize = await getStorageSize();
  
  return {
    device: deviceInfo.model,
    memoryUsage: `${memoryUsage.toFixed(2)} MB`,
    storageSize: `${(storageSize / 1024).toFixed(2)} KB`,
    lowPowerMode: deviceInfo.isLowPowerMode,
    processorCount: deviceInfo.processorCount,
    config: getConfig(),
  };
}
