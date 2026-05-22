import { useState } from 'react';
import { useNarcanWatch } from '../hooks/useNarcanWatch.js';

export default function HelpNowButton() {
  const { triggerHelpNow, resolveAlert, isLocating, alertActive, error } = useNarcanWatch();
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = async () => {
    const result = await triggerHelpNow();
    if (result.success) {
      setShowAlert(true);
    }
  };

  const handleResolve = async () => {
    await resolveAlert();
    setShowAlert(false);
  };

  if (alertActive && showAlert) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-red text-dark p-6 rounded-lg shadow-lg max-w-sm">
        <h3 className="text-xl font-bold mb-2">🚨 Help is Coming</h3>
        <p className="mb-4">
          Misfit First Responders with Narcan are being notified of your location. Stay with me. Help is on the way.
        </p>
        <button
          onClick={handleResolve}
          className="bg-dark text-red px-4 py-2 rounded font-bold hover:bg-dark-border transition"
        >
          Alert Resolved
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLocating}
      className="fixed top-4 right-4 z-50 bg-red text-dark px-6 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:opacity-50"
    >
      {isLocating ? '📍 Locating...' : '🆘 Help Now'}
    </button>
  );
}
