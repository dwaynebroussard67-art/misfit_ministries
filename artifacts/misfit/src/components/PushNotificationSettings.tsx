import { usePushNotifications } from '../hooks/usePushNotifications';

export function PushNotificationSettings() {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <div className=\"bg-dark-border p-4 rounded text-text-secondary text-sm\">
        Push notifications are not supported on this device.
      </div>
    );
  }

  return (
    <div className=\"space-y-4\">
      <div className=\"bg-surface p-4 rounded border border-dark-border\">
        <h3 className=\"font-bold text-gold mb-2\">Push Notifications</h3>
        <p className=\"text-text-secondary text-sm mb-4\">
          Get instant alerts for OD emergencies, crisis prayers, and Narcan shipments.
        </p>

        {isSubscribed ? (
          <div className=\"space-y-3\">
            <div className=\"flex items-center gap-2 text-green-500\">
              <span>✓</span>
              <span className=\"text-sm\">Push notifications enabled</span>
            </div>
            <button
              onClick={unsubscribe}
              disabled={isLoading}
              className=\"w-full bg-red text-white px-4 py-2 rounded font-bold hover:bg-red/80 transition disabled:opacity-50\"
            >
              {isLoading ? 'Disabling...' : 'Disable Notifications'}
            </button>
          </div>
        ) : (
          <button
            onClick={subscribe}
            disabled={isLoading}
            className=\"w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50\"
          >
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </button>
        )}
      </div>

      <div className=\"bg-dark-border p-3 rounded text-text-secondary text-xs\">
        <p className=\"font-bold mb-1\">What you'll receive:</p>
        <ul className=\"space-y-1 list-disc list-inside\">
          <li>🚨 OD emergency alerts with location</li>
          <li>🆘 Crisis prayer flags</li>
          <li>📦 Narcan shipment notifications</li>
          <li>✅ Action confirmations</li>
        </ul>
      </div>
    </div>
  );
}

