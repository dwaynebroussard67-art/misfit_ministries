import { useState, useCallback } from 'react';
import axios from 'axios';

export interface ResponderLocation {
  responderId: number;
  lat: number;
  lng: number;
}

export function useNarcanWatch() {
  const [isLocating, setIsLocating] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [alertId, setAlertId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getResponderLocations = useCallback(async (): Promise<ResponderLocation[]> => {
    // In production, this would fetch from /api/narcan/responders
    // For now, return empty array (responders share location only during alert)
    return [];
  }, []);

  const triggerHelpNow = useCallback(async () => {
    try {
      setIsLocating(true);
      setError(null);

      // Get user's current location
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          err => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      // Get responder locations (client-side only, never stored)
      const responderLocations = await getResponderLocations();

      // Send OD alert to server
      const response = await axios.post('/api/narcan/alert', {
        lat: position.latitude,
        lng: position.longitude,
        location_description: 'OD Alert - Help Needed',
        responder_locations: responderLocations,
      });

      setAlertActive(true);
      setAlertId(response.data.alert_id);

      return {
        success: true,
        alert_id: response.data.alert_id,
        closest_responders: response.data.closest_responders_count,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send alert';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLocating(false);
    }
  }, [getResponderLocations]);

  const resolveAlert = useCallback(async () => {
    if (!alertId) return;

    try {
      await axios.patch(`/api/narcan/alert/${alertId}/resolve`);
      setAlertActive(false);
      setAlertId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resolve alert';
      setError(message);
    }
  }, [alertId]);

  return {
    triggerHelpNow,
    resolveAlert,
    isLocating,
    alertActive,
    alertId,
    error,
  };
}
