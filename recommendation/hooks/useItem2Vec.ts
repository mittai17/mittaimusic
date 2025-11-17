/**
 * React Hook for Item2Vec
 * Works across web and React Native
 * 
 * Note: Requires React
 * Install: npm install react
 */

// @ts-ignore - React dependency
import { useState, useEffect, useCallback, useRef } from 'react';

interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  progress: number;
}

interface UseItem2VecOptions {
  autoLoad?: boolean;
  autoSave?: boolean;
  platform?: 'web' | 'mobile';
}

interface UseItem2VecReturn {
  isLoading: boolean;
  isTraining: boolean;
  progress: TrainingProgress | null;
  error: Error | null;
  memoryUsage: number;
  train: (sessions: any[], config?: any) => Promise<void>;
  update: (sessions: any[], iterations?: number) => Promise<void>;
  getSimilar: (trackId: string, topN?: number) => Array<{ id: string; score: number }>;
  computeSimilarity: (trackA: string, trackB: string) => number;
  save: () => Promise<void>;
  load: () => Promise<void>;
  clear: () => Promise<void>;
  exportData: () => string;
  importData: (data: string) => void;
}

export function useItem2Vec(options: UseItem2VecOptions = {}): UseItem2VecReturn {
  const { autoLoad = true, autoSave = true, platform = 'web' } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [memoryUsage, setMemoryUsage] = useState(0);

  const apiRef = useRef<any>(null);

  // Dynamically load the appropriate API
  useEffect(() => {
    const loadAPI = async () => {
      try {
        if (platform === 'mobile') {
          apiRef.current = await import('../engine/item2vec.mobile.js');
        } else {
          apiRef.current = await import('../engine/item2vec.web.js');
        }

        if (autoLoad) {
          await load();
        }
      } catch (err) {
        setError(err as Error);
      }
    };

    loadAPI();
  }, [platform, autoLoad]);

  // Update memory usage periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (apiRef.current?.getMemoryUsage) {
        setMemoryUsage(apiRef.current.getMemoryUsage());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const train = useCallback(async (sessions: any[], config?: any) => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    setIsTraining(true);
    setError(null);
    setProgress(null);

    try {
      const { trainEmbeddings } = await import('../engine/item2vec.js');
      
      await trainEmbeddings(sessions, config, (p) => {
        setProgress(p);
      });

      if (autoSave) {
        await apiRef.current.saveEmbeddingsToStorage();
      }

      setMemoryUsage(apiRef.current.getMemoryUsage());
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsTraining(false);
    }
  }, [autoSave]);

  const update = useCallback(async (sessions: any[], iterations: number = 5) => {
    if (!apiRef.current) {
      throw new Error('API not loaded');
    }

    setIsTraining(true);
    setError(null);

    try {
      const { updateEmbeddings } = await import('../engine/item2vec.js');
      await updateEmbeddings(sessions, iterations);

      if (autoSave) {
        await apiRef.current.saveEmbeddingsToStorage();
      }

      setMemoryUsage(apiRef.current.getMemoryUsage());
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsTraining(false);
    }
  }, [autoSave]);

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
        setMemoryUsage(apiRef.current.getMemoryUsage());
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
      setMemoryUsage(0);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const exportData = useCallback(() => {
    const { exportEmbeddings } = require('../engine/item2vec.js');
    return exportEmbeddings();
  }, []);

  const importData = useCallback((data: string) => {
    const { importEmbeddings } = require('../engine/item2vec.js');
    importEmbeddings(data);
    setMemoryUsage(apiRef.current?.getMemoryUsage() || 0);
  }, []);

  return {
    isLoading,
    isTraining,
    progress,
    error,
    memoryUsage,
    train,
    update,
    getSimilar,
    computeSimilarity,
    save,
    load,
    clear,
    exportData,
    importData,
  };
}
