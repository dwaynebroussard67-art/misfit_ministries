import { useNotifications, Notification } from '../hooks/useNotifications';
import { useState } from 'react';

interface NotificationCenterProps {
  userId: string;
  role: 'admin' | 'moderator';
}

export function NotificationCenter({ userId, role }: NotificationCenterProps) {
  const { notifications, isConnected, clearNotification, clearAll } = useNotifications(userId, role);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gold text-dark px-4 py-2 rounded-full font-bold hover:bg-yellow-600 transition"
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-96 bg-surface rounded-lg shadow-lg border border-dark-border max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-dark-border p-4 border-b border-dark-border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gold">Notifications</h3>
              <p className="text-text-secondary text-xs">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={clearAll}
                className="text-text-secondary hover:text-text-primary text-xs font-bold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-secondary">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {notifications.map((notification, i) => (
                <NotificationItem
                  key={i}
                  notification={notification}
                  onDismiss={() => clearNotification(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  const priorityColor =
    notification.priority === 'high'
      ? 'border-l-4 border-red bg-red/10'
      : notification.priority === 'normal'
      ? 'border-l-4 border-gold bg-gold/10'
      : 'border-l-4 border-text-secondary bg-text-secondary/10';

  const typeEmoji = {
    prayer_crisis: '🚨',
    testimony_pending: '📝',
    shipment_arrived: '📦',
    order_completed: '💳',
    content_approved: '✅',
  }[notification.type];

  return (
    <div className={`p-4 ${priorityColor} hover:bg-dark-border/50 transition cursor-pointer`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2">
          <span className="text-lg">{typeEmoji}</span>
          <div>
            <p className="font-bold text-text-primary">{notification.title}</p>
            <p className="text-text-secondary text-sm">{notification.message}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-text-secondary hover:text-text-primary font-bold"
        >
          ✕
        </button>
      </div>
      <p className="text-text-secondary text-xs">
        {new Date(notification.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}

