import { useEffect, useState } from 'react';
import { PushNotificationManager } from '../utils/push-notifications';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      const supported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      setIsSupported(supported);

      if (supported) {
        const subscribed = await PushNotificationManager.isSubscribed();
        setIsSubscribed(subscribed);
      }

      setIsLoading(false);
    };

    checkSupport();
  }, []);

  const subscribe = async () => {
    setIsLoading(true);
    try {
      const subscription = await PushNotificationManager.subscribe();
      setIsSubscribed(subscription !== null);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await PushNotificationManager.unsubscribe();
      setIsSubscribed(!success);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}

