import { useEffect, useState } from 'react';

interface ElectronAPI {
  store: {
    get: <T>(key: string) => Promise<T>;
    set: <T>(key: string, value: T) => Promise<boolean>;
  };
  platform: string;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

interface UseElectronStore {
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<boolean>;
  platform: string | null;
  isElectron: boolean;
}

/**
 * Hook to access Electron APIs safely from React
 */
export function useElectron(): UseElectronStore {
  const [platform, setPlatform] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && 'electron' in window && window.electron) {
      setIsElectron(true);
      setPlatform(window.electron.platform);
    }
  }, []);

  const getItem = async <T,>(key: string): Promise<T | null> => {
    if (!isElectron || typeof window === 'undefined' || !window.electron) return null;
    try {
      return await window.electron.store.get<T>(key);
    } catch (error) {
      console.error('Failed to get item from Electron store:', error);
      return null;
    }
  };

  const setItem = async <T,>(key: string, value: T): Promise<boolean> => {
    if (!isElectron || typeof window === 'undefined' || !window.electron) return false;
    try {
      return await window.electron.store.set<T>(key, value);
    } catch (error) {
      console.error('Failed to set item in Electron store:', error);
      return false;
    }
  };

  return {
    getItem,
    setItem,
    platform,
    isElectron,
  };
} 