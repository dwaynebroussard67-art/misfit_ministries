/**
 * Offline Storage Manager
 * Handles caching and offline data persistence
 */

const STORAGE_PREFIX = 'misfit_';
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expires: number;
}

export class OfflineStorage {
  static setItem<T>(key: string, value: T, expiryMs: number = EXPIRY_TIME): void {
    try {
      const cached: CachedData<T> = {
        data: value,
        timestamp: Date.now(),
        expires: Date.now() + expiryMs,
      };
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(cached));
    } catch (error) {
      console.error('Error saving to offline storage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (!item) return null;

      const cached: CachedData<T> = JSON.parse(item);

      // Check if expired
      if (Date.now() > cached.expires) {
        localStorage.removeItem(STORAGE_PREFIX + key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error reading from offline storage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  static clear(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  static cachePrayers(prayers: any[]): void {
    this.setItem('prayers', prayers);
  }

  static getPrayerCache(): any[] | null {
    return this.getItem('prayers');
  }

  static cacheResponders(responders: any[]): void {
    this.setItem('responders', responders);
  }

  static getRespondersCache(): any[] | null {
    return this.getItem('responders');
  }

  static cacheResources(resources: any[]): void {
    this.setItem('resources', resources);
  }

  static getResourcesCache(): any[] | null {
    return this.getItem('resources');
  }

  static saveOfflineAction(action: any): void {
    const actions = this.getItem<any[]>('offline_actions') || [];
    actions.push({
      ...action,
      timestamp: Date.now(),
      synced: false,
    });
    this.setItem('offline_actions', actions);
  }

  static getOfflineActions(): any[] {
    return this.getItem('offline_actions') || [];
  }

  static clearOfflineActions(): void {
    this.removeItem('offline_actions');
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }
}

// Register service worker
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Listen for online/offline events
export function setupOfflineListeners(onOnline?: () => void, onOffline?: () => void): void {
  window.addEventListener('online', () => {
    console.log('App is online');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('App is offline');
    onOffline?.();
  });
}

