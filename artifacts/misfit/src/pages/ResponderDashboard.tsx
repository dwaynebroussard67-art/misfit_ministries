import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function ResponderDashboard() {
  const [responderId, setResponderId] = useState<number | null>(null);
  const [narcanCount, setNarcanCount] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Subscribe to real-time alerts
  useEffect(() => {
    if (!responderId) return;

    const eventSource = new EventSource(`/api/narcan/subscribe?responderId=${responderId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'od_alert') {
        setAlerts(prev => [data, ...prev]);
        // Play alert sound
        playAlertSound();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [responderId]);

  const { data: profile } = useQuery({
    queryKey: ['responder-profile', responderId],
    queryFn: async () => {
      if (!responderId) return null;
      const res = await axios.get(`/api/narcan/responder/${responderId}`);
      return res.data;
    },
    enabled: !!responderId,
  });

  const updateNarcanMutation = useMutation({
    mutationFn: async (count: number) => {
      const res = await axios.patch(`/api/narcan/responder/${responderId}`, {
        narcan_count: count,
      });
      return res.data;
    },
  });

  const respondMutation = useMutation({
    mutationFn: async (alertId: number) => {
      const res = await axios.post('/api/narcan/respond', {
        responder_id: responderId,
        distance_miles: 0.5,
        eta_seconds: 120,
      });
      return res.data;
    },
  });

  const playAlertSound = () => {
    // Play alert tone
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  if (!responderId) {
    return (
      <div className="min-h-screen bg-dark p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gold mb-6">Responder Dashboard</h1>
          <p className="text-text-secondary mb-8">
            Enter your responder ID to access your dashboard and receive real-time OD alerts.
          </p>
          <input
            type="number"
            placeholder="Enter your responder ID"
            onChange={e => setResponderId(parseInt(e.target.value))}
            className="w-full bg-dark-border text-text-primary px-4 py-3 rounded-lg mb-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Your Responder Dashboard</h1>
          <p className="text-text-secondary">
            You're part of the Misfit First Responders network. Be ready to save a life.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface p-6 rounded-lg">
            <p className="text-gold text-3xl font-bold">{profile?.saves_count || 0}</p>
            <p className="text-text-secondary">Lives Saved</p>
          </div>
          <div className="bg-surface p-6 rounded-lg">
            <p className="text-gold text-3xl font-bold">{narcanCount}</p>
            <p className="text-text-secondary">Narcan Kits</p>
            <button
              onClick={() => {
                const newCount = narcanCount + 1;
                setNarcanCount(newCount);
                updateNarcanMutation.mutate(newCount);
              }}
              className="mt-4 bg-gold text-dark px-3 py-1 rounded text-sm font-bold hover:bg-yellow-600 transition"
            >
              Add Kit
            </button>
          </div>
          <div className="bg-surface p-6 rounded-lg">
            <p className="text-green text-3xl font-bold">{alerts.length}</p>
            <p className="text-text-secondary">Active Alerts</p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gold mb-4">Active OD Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-text-secondary">No active alerts. Stay ready.</p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <div key={i} className="bg-dark-border p-4 rounded-lg border-l-4 border-red">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-red">🚨 OD Alert</p>
                      <p className="text-text-secondary text-sm">
                        {alert.distance_miles?.toFixed(1)} miles away
                      </p>
                      <p className="text-text-secondary text-sm">
                        ETA: {Math.round((alert.eta_seconds || 0) / 60)} minutes
                      </p>
                    </div>
                    <button
                      onClick={() => respondMutation.mutate(alert.alert_id)}
                      disabled={respondMutation.isPending}
                      className="bg-red text-dark px-4 py-2 rounded font-bold hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {respondMutation.isPending ? 'Responding...' : 'I\'m Going'}
                    </button>
                  </div>
                  <p className="text-text-secondary text-sm">
                    {alert.location_description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-dark-border rounded-lg border border-gold">
          <p className="text-text-secondary text-sm">
            🔒 <strong>Your location is private.</strong> It's only shared when you respond to an alert. After the alert is resolved, all location data is deleted.
          </p>
        </div>
      </div>
    </div>
  );
}
