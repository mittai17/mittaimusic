/**
 * iOS-optimized React Hook for Item2Vec
 * 
 * Features:
 * - Automatic device detection
 * - Battery-aware training
 * - Memory pressure handling
 * - Background training support
 * - iCloud sync support
 */

// @ts-ignore - React Native
import { useState, useEffect, useCallback, useRef } from 'react';
// @ts-ignore - React Native
import { AppState, Platform } from 'react-native';

interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  progress: number;
}

interface IOSDeviceMetrics {
  model: string;
  memoryUsage: string;
  storageSize: string;
  lowPowerMode: boolean;
  canTrain: boolean;
}

interface UseItem2VecIOSOptions {
  autoLoad?: boolean;
  autoSave?: boolean;
  enableBackgroundTraining?: boolean;
  enableICloudSync?: boolean;
  respectLowPowerMode?: boolean;
}

interface UseItem2VecIOSReturn {
  isLoading: boolean;
  isTraining: boolean;
  progress: TrainingProgress | null;
  error: Error | null;
  deviceMetrics: IOSDeviceMetrics | null;
  train: (sessions: any[]) => Promise<void>;
  update: (sessions: any[], iterations?: number) => Promise<void>;
  getSimilar: (trackId: string, topN?: number) => Array<{ id: string; score: number }>;
  computeSimilarity: (trackA: string, trackB: string) => number;
  save: () => Promise<void>;
  load: () => Promise<void>;
  clear: () => Promise<void>;
  scheduleBackgroundTraining: (sessions: any[]) => Promise<void>;
  syncToICloud: () => Promise<void>;
  syncFromICloud: (data: string) => Promise<void>;
  canTrain: (trackCount: number) => Promise<boolean>;
}

export function useItem2VecIOS(options: UseItem2VecIOSOptions = {}): UseItem2VecIOSReturn {
  const {
    autoLoad = true,
    autoSave = true,
    enableBackgroundTraining = false,
    enableICloudSync = false,
    respectLowPowerMode = true,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [deviceMetrics, setDeviceMetrics] = useState<IOSDeviceMetrics | null>(null);

  const apiRef = useRef<any>(null);
  const appStateRef = useRef(AppState.currentState);

  // Check if running on iOS
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setError(new Error('This hook is designed for iOS only'));
      return;
    }
  }, []);

  // Load iOS API
  useEffect(() => {
    const loadAPI = async () => {
      try {
        apiRef.current = await import('../engine/item2vec.ios.js');

        if (autoLoad) {
          await load();
        }

        // Update device metrics
        await updateDeviceMetrics();
      } catch (err) {
        setError(err as Error);
      }
    };

    loadAPI();
  }, [autoLoad]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: any) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        console.log('App resumed - checking for updates');
        await updateDeviceMetrics();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle memory warnings
  useEffect(() => {
    const handleMemoryWarning = async () => {
      console.warn('⚠️ Memory warning received');
      if (apiRef.current?.handleMemoryWarning) {
        await apiRef.current.handleMemoryWarning();
      }
    };

    // @ts-ignore - React Native DeviceEventEmitter
    const { DeviceEventEmitter } = require('react-native');
    const subscription = DeviceEventEmitter.addListener('memoryWarning', handleMemoryWarning);

    return () => {
      subscription.remove();
    };
  }, []);

  const updateDeviceMetrics = useCallback(async () => {
    if (!apiRef.current) return;

    try {
      const metrics = await apiRef.current.getPerformanceMetrics();
      setDeviceMetrics({
        model: metrics.device,
        memoryUsage: metrics.memoryUsage,
        storageSize: metrics.storageSize,
        lowPowerMode: metrics.lowPowerMode,
        canTrain: !metrics.lowPowerMode,
      });
    } catch (err) {
      console.error('Failed to get device metrics:', err);
    }
  }, []);

  const train = useCallback(async (sessions: any[]) => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    // Check low power mode
    if (respectLowPowerMode && deviceMetrics?.lowPowerMode) {
      const shouldContinue = confirm('Device is in Low Power Mode. Training may drain battery. Continue?');
      if (!shouldContinue) {
        return;
      }
    }

    setIsTraining(true);
    setError(null);
    setProgress(null);

    try {
      await apiRef.current.trainAndSave(sessions, (p: TrainingProgress) => {
        setProgress(p);
      });

      await updateDeviceMetrics();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsTraining(false);
    }
  }, [respectLowPowerMode, deviceMetrics]);

  const update = useCallback(async (sessions: any[], iterations: number = 5) => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    setIsTraining(true);
    setError(null);

    try {
      await apiRef.current.updateAndSave(sessions, iterations);
      await updateDeviceMetrics();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsTraining(false);
    }
  }, []);

  const getSimilar = useCallback((trackId: string, topN: number = 10) => {
    if (!apiRef.current) return [];
    return apiRef.current.getSimilar(trackId, topN);
  }, []);

  const computeSimilarity = useCallback((trackA: string, trackB: string) => {
    if (!apiRef.current) return 0;
    return apiRef.current.computeEmbeddingSimilarity(trackA, trackB);
  }, []);

  const save = useCallback(async () => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    setIsLoading(true);
    try {
      await apiRef.current.saveEmbeddingsToStorage();
      await updateDeviceMetrics();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const load = useCallback(async () => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    setIsLoading(true);
    try {
      const loaded = await apiRef.current.loadEmbeddingsFromStorage();
      if (loaded) {
        await updateDeviceMetrics();
      }
      return loaded;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(async () => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    try {
      await apiRef.current.clearStorage();
      await updateDeviceMetrics();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const scheduleBackgroundTraining = useCallback(async (sessions: any[]) => {
    if (!apiRef.current || !enableBackgroundTraining) {
      throw new Error('Background training not enabled');
    }

    try {
      await apiRef.current.scheduleBackgroundTraining(sessions);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [enableBackgroundTraining]);

  const syncToICloud = useCallback(async () => {
    if (!apiRef.current || !enableICloudSync) {
      throw new Error('iCloud sync not enabled');
    }

    try {
      const data = await apiRef.current.exportForICloud();
      // Store to iCloud (requires native module)
      console.log('iCloud sync - data ready for upload');
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [enableICloudSync]);

  const syncFromICloud = useCallback(async (data: string) => {
    if (!apiRef.current || !enableICloudSync) {
      throw new Error('iCloud sync not enabled');
    }

    try {
      await apiRef.current.importFromICloud(data);
      await updateDeviceMetrics();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [enableICloudSync]);

  const canTrain = useCallback(async (trackCount: number) => {
    if (!apiRef.current) return false;
    return apiRef.current.canTrain(trackCount);
  }, []);

  return {
    isLoading,
    isTraining,
    progress,
    error,
    deviceMetrics,
    train,
    update,
    getSimilar,
    computeSimilarity,
    save,
    load,
    clear,
    scheduleBackgroundTraining,
    syncToICloud,
    syncFromICloud,
    canTrain,
  };
}
