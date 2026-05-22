import { useEffect, useState, useCallback } from 'react';

export interface Notification {
  type: 'prayer_crisis' | 'testimony_pending' | 'shipment_arrived' | 'order_completed' | 'content_approved';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  priority: 'high' | 'normal' | 'low';
}

export function useNotifications(userId: string, role: 'admin' | 'moderator' = 'moderator') {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/notifications/subscribe?userId=${userId}&role=${role}`
    );

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'connected') {
          setNotifications(prev => [data, ...prev]);
          // Play notification sound
          playNotificationSound(data.priority);
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [userId, role]);

  const clearNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    isConnected,
    clearNotification,
    clearAll,
  };
}

function playNotificationSound(priority: 'high' | 'normal' | 'low') {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Higher frequency for high priority
  oscillator.frequency.value = priority === 'high' ? 1000 : 600;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

