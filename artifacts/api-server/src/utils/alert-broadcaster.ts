/**
 * Real-Time OD Alert Broadcasting
 * 
 * Uses Server-Sent Events (SSE) for one-way push notifications
 * Responders receive alerts in real-time
 * Privacy-first: only victim location shared, responder locations never exposed
 */

import { Response } from 'express';

interface AlertSubscriber {
  res: Response;
  responderId: number;
  city?: string;
}

const subscribers: AlertSubscriber[] = [];

export function subscribeToAlerts(res: Response, responderId: number, city?: string): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection message
  res.write('data: {"type":"connected","message":"Connected to alert system"}\n\n');

  const subscriber: AlertSubscriber = { res, responderId, city };
  subscribers.push(subscriber);

  // Remove subscriber on disconnect
  res.on('close', () => {
    const index = subscribers.indexOf(subscriber);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  });
}

export interface OdAlertBroadcast {
  alert_id: number;
  lat: number;
  lng: number;
  distance_miles: number;
  eta_seconds: number;
  location_description?: string;
  created_at: Date | string;
}

export function broadcastOdAlert(alert: OdAlertBroadcast, targetCity?: string): void {
  const message = JSON.stringify({
    type: 'od_alert',
    alert_id: alert.alert_id,
    distance_miles: alert.distance_miles,
    eta_seconds: alert.eta_seconds,
    location_description: alert.location_description || 'OD Alert - Help Needed',
    created_at: alert.created_at,
  });

  subscribers.forEach(subscriber => {
    // Only send to responders in the same city (if city filtering enabled)
    if (!targetCity || subscriber.city === targetCity) {
      try {
        subscriber.res.write(`data: ${message}\n\n`);
      } catch (error) {
        console.error('Error broadcasting to subscriber:', error);
      }
    }
  });
}

export function getSubscriberCount(): number {
  return subscribers.length;
}

export function getSubscribersByCity(city: string): number {
  return subscribers.filter(s => s.city === city).length;
}
