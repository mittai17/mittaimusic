/**
 * Web-specific wrapper for Item2Vec
 * Optimized for browser environments
 * 
 * Features:
 * - LocalStorage/IndexedDB integration
 * - Web Worker support for non-blocking training
 * - Service Worker caching
 * - Progressive Web App support
 * 
 * Note: Requires DOM environment (browser)
 */

/// <reference lib="dom" />

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

const STORAGE_KEY = 'youtify_embeddings';
const DB_NAME = 'YoutifyDB';
const DB_VERSION = 1;
const STORE_NAME = 'embeddings';

/**
 * Save to localStorage (fallback)
 */
function saveToLocalStorage(data: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.warn('LocalStorage full, clearing old data...');
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, data);
  }
}

/**
 * Load from localStorage
 */
function loadFromLocalStorage(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Save to IndexedDB (preferred for large datasets)
 */
async function saveToIndexedDB(data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      store.put({ id: STORAGE_KEY, data, timestamp: Date.now() });
      
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      
      transaction.onerror = () => reject(transaction.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Load from IndexedDB
 */
async function loadFromIndexedDB(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close();
        resolve(null);
        return;
      }

      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(STORAGE_KEY);
      
      getRequest.onsuccess = () => {
        db.close();
        resolve(getRequest.result?.data || null);
      };
      
      getRequest.onerror = () => {
        db.close();
        reject(getRequest.error);
      };
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Save embeddings to browser storage
 * Uses IndexedDB for large datasets, falls back to localStorage
 */
export async function saveEmbeddingsToStorage(): Promise<void> {
  try {
    const data = exportEmbeddings();
    const sizeKB = data.length / 1024;

    if (sizeKB > 5000) {
      // Use IndexedDB for large datasets (>5MB)
      await saveToIndexedDB(data);
      console.log(`✓ Embeddings saved to IndexedDB (${sizeKB.toFixed(0)}KB)`);
    } else {
      // Use localStorage for smaller datasets
      saveToLocalStorage(data);
      console.log(`✓ Embeddings saved to localStorage (${sizeKB.toFixed(0)}KB)`);
    }
  } catch (error) {
    console.error('Failed to save embeddings:', error);
    throw error;
  }
}

/**
 * Load embeddings from browser storage
 */
export async function loadEmbeddingsFromStorage(): Promise<boolean> {
  try {
    // Try IndexedDB first
    let data = await loadFromIndexedDB();
    
    // Fallback to localStorage
    if (!data) {
      data = loadFromLocalStorage();
    }

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
 * Train embeddings with automatic storage
 */
export async function trainAndSave(
  sessions: any[],
  onProgress?: (progress: any) => void
): Promise<void> {
  await trainEmbeddings(sessions, undefined, onProgress);
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
 * Clear all storage
 */
export async function clearStorage(): Promise<void> {
  try {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Clear IndexedDB
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    clearEmbeddings();
    console.log('✓ Storage cleared');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * Get storage usage estimate
 */
export async function getStorageUsage(): Promise<{ used: number; quota: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  
  return { used: 0, quota: 0 };
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export for sharing/backup
 */
export function downloadEmbeddings(filename: string = 'youtify-embeddings.json'): void {
  const data = exportEmbeddings();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Import from file
 */
export function uploadEmbeddings(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importEmbeddings(data);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
