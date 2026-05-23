import { useEffect, useState } from 'react';
import { OfflineStorage } from '../utils/offline-storage';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineActions, setOfflineActions] = useState(0);

  useEffect(() => {
    setIsOnline(OfflineStorage.isOnline());
    setOfflineActions(OfflineStorage.getOfflineActions().length);

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && offlineActions === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg font-bold text-sm md:text-base z-40 ${
        isOnline
          ? 'bg-yellow-600 text-dark'
          : 'bg-red text-white'
      }`}
    >
      {!isOnline ? (
        <div className="flex items-center gap-2">
          <span>🔴</span>
          <span>Offline Mode - Data will sync when online</span>
        </div>
      ) : offlineActions > 0 ? (
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <span>{offlineActions} action(s) pending sync</span>
        </div>
      ) : null}
    </div>
  );
}

