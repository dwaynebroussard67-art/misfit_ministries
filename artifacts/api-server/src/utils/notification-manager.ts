/**
 * Real-Time Notification Manager
 * Manages WebSocket connections for Forge admin notifications
 */

import { Response } from 'express';

interface NotificationSubscriber {
  res: Response;
  userId: string;
  role: 'admin' | 'moderator';
}

interface ForgeNotification {
  type: 'prayer_crisis' | 'testimony_pending' | 'shipment_arrived' | 'order_completed' | 'content_approved';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  priority: 'high' | 'normal' | 'low';
}

const subscribers: NotificationSubscriber[] = [];

export function subscribeToNotifications(res: Response, userId: string, role: 'admin' | 'moderator'): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection message
  res.write('data: {"type":"connected","message":"Connected to notification system"}\n\n');

  const subscriber: NotificationSubscriber = { res, userId, role };
  subscribers.push(subscriber);

  // Remove subscriber on disconnect
  res.on('close', () => {
    const index = subscribers.indexOf(subscriber);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  });
}

export function broadcastNotification(notification: ForgeNotification, targetRole?: 'admin' | 'moderator'): void {
  const message = JSON.stringify({
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
    timestamp: notification.timestamp,
    priority: notification.priority,
  });

  subscribers.forEach(subscriber => {
    // Send to all admins, or specific role if specified
    if (!targetRole || subscriber.role === targetRole || subscriber.role === 'admin') {
      try {
        subscriber.res.write(`data: ${message}\n\n`);
      } catch (error) {
        console.error('Error broadcasting notification:', error);
      }
    }
  });
}

export function notifyCrisisPrayer(prayerId: number, name: string, keywords: string[]): void {
  broadcastNotification({
    type: 'prayer_crisis',
    title: '🚨 Crisis Prayer Detected',
    message: `Prayer from ${name} flagged for crisis keywords: ${keywords.join(', ')}`,
    data: { prayerId, keywords },
    timestamp: new Date(),
    priority: 'high',
  }, 'admin');
}

export function notifyTestimonyPending(testimonyId: number, title: string): void {
  broadcastNotification({
    type: 'testimony_pending',
    title: 'New Testimony Awaiting Approval',
    message: `"${title}" needs your review`,
    data: { testimonyId },
    timestamp: new Date(),
    priority: 'normal',
  }, 'moderator');
}

export function notifyShipmentArrived(shipmentId: string, quantity: number, location: string): void {
  broadcastNotification({
    type: 'shipment_arrived',
    title: '📦 Narcan Shipment Arrived',
    message: `${quantity} kits received at ${location}`,
    data: { shipmentId, quantity, location },
    timestamp: new Date(),
    priority: 'high',
  }, 'admin');
}

export function notifyOrderCompleted(orderId: number, customerEmail: string, amount: number): void {
  broadcastNotification({
    type: 'order_completed',
    title: '💳 Store Order Completed',
    message: `Order from ${customerEmail} for $${(amount / 100).toFixed(2)}`,
    data: { orderId, customerEmail, amount },
    timestamp: new Date(),
    priority: 'normal',
  }, 'admin');
}

export function notifyContentApproved(contentId: number, title: string, platforms: string[]): void {
  broadcastNotification({
    type: 'content_approved',
    title: '✅ Content Approved for Publishing',
    message: `"${title}" approved for ${platforms.join(', ')}`,
    data: { contentId, platforms },
    timestamp: new Date(),
    priority: 'normal',
  });
}

export function getSubscriberCount(): number {
  return subscribers.length;
}

export function getAdminCount(): number {
  return subscribers.filter(s => s.role === 'admin').length;
}
