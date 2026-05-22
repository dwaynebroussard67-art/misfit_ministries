import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function MisfitFirstResponders() {
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    narcan_count: 0,
  });

  const { data: stats } = useQuery({
    queryKey: ['narcan-stats'],
    queryFn: async () => {
      const res = await axios.get('/api/narcan/stats');
      return res.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post('/api/narcan/register', {
        user_id: `user-${Date.now()}`,
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      setShowRegister(false);
      setFormData({ name: '', phone: '', narcan_count: 0 });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">Misfit First Responders</h1>
          <p className="text-2xl text-text-secondary mb-6">
            Dope fiend saves dope fiend. Every person in recovery can be a first responder.
          </p>
          <p className="text-lg text-text-secondary mb-8">
            We're putting Narcan in the hands of every dope fiend on the planet. When someone ODs, the person next to them hits a button. You get the alert. You save a life.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-surface p-6 rounded-lg">
              <p className="text-gold text-3xl font-bold">{stats.total_responders}</p>
              <p className="text-text-secondary">Misfit First Responders</p>
            </div>
            <div className="bg-surface p-6 rounded-lg">
              <p className="text-gold text-3xl font-bold">{stats.active_responders}</p>
              <p className="text-text-secondary">Active Right Now</p>
            </div>
            <div className="bg-surface p-6 rounded-lg">
              <p className="text-gold text-3xl font-bold">{stats.total_narcan}</p>
              <p className="text-text-secondary">Narcan Kits in Network</p>
            </div>
            <div className="bg-surface p-6 rounded-lg">
              <p className="text-green text-3xl font-bold">{stats.total_saves}</p>
              <p className="text-text-secondary">Lives Saved</p>
            </div>
          </div>
        )}

        {/* Register Button */}
        <div className="mb-12">
          {!showRegister ? (
            <button
              onClick={() => setShowRegister(true)}
              className="bg-gold text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
            >
              Join Misfit First Responders
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg max-w-md">
              <h2 className="text-2xl font-bold text-gold mb-6">Register as Responder</h2>
              
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Name (optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded"
                />
              </div>

              <div className="mb-6">
                <label className="block text-text-secondary mb-2">Narcan Kits You Have</label>
                <input
                  type="number"
                  min="0"
                  value={formData.narcan_count}
                  onChange={e => setFormData({ ...formData, narcan_count: parseInt(e.target.value) })}
                  className="w-full bg-dark-border text-text-primary px-4 py-2 rounded"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex-1 bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {registerMutation.isPending ? 'Registering...' : 'Register'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="flex-1 bg-dark-border text-text-secondary px-4 py-2 rounded font-bold hover:bg-dark transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-surface p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gold mb-6">How It Works</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gold mb-2">1. Someone ODs</h3>
              <p className="text-text-secondary">
                A dope fiend is overdosing. The person next to them hits "Help Now" on their phone.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gold mb-2">2. Alert Sent</h3>
              <p className="text-text-secondary">
                Their location is sent to all Misfit First Responders in the city who have Narcan.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gold mb-2">3. Closest Responder Moves</h3>
              <p className="text-text-secondary">
                You get the alert. You're 0.3 miles away. You grab your Narcan and move.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gold mb-2">4. Save a Life</h3>
              <p className="text-text-secondary">
                You administer Narcan. The person comes back. You saved a life. You're a hero.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-12 bg-dark-border p-6 rounded-lg border border-gold">
          <h3 className="text-xl font-bold text-gold mb-2">🔒 Your Privacy is Protected</h3>
          <p className="text-text-secondary">
            Your location is NEVER tracked. It's only shared when someone needs help. During an alert, only the closest responders see the victim's location. After the alert is resolved, all location data is deleted. We respect the privacy of people in recovery.
          </p>
        </div>
      </div>
    </div>
  );
}
