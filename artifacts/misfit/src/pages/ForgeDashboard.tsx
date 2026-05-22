import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function ForgeDashboard() {
  const [tab, setTab] = useState<'prayers' | 'testimonies' | 'content' | 'site-copy'>('prayers');
  const [editingCopy, setEditingCopy] = useState<{ key: string; value: string } | null>(null);

  // Prayers
  const { data: prayersData, refetch: refetchPrayers } = useQuery({
    queryKey: ['forge-prayers'],
    queryFn: async () => {
      const res = await axios.get('/api/forge/prayers');
      return res.data;
    },
  });

  // Testimonies
  const { data: testimoniesData, refetch: refetchTestimonies } = useQuery({
    queryKey: ['forge-testimonies'],
    queryFn: async () => {
      const res = await axios.get('/api/forge/testimonies');
      return res.data;
    },
  });

  // Site Copy
  const { data: siteCopyData } = useQuery({
    queryKey: ['site-copy'],
    queryFn: async () => {
      const res = await axios.get('/api/forge/site-copy');
      return res.data;
    },
  });

  // Mutations
  const updatePrayerMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await axios.patch(`/api/forge/prayers/${id}`, { status });
    },
    onSuccess: () => refetchPrayers(),
  });

  const deletePrayerMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/forge/prayers/${id}`);
    },
    onSuccess: () => refetchPrayers(),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      await axios.patch(`/api/forge/testimonies/${id}`, { approved });
    },
    onSuccess: () => refetchTestimonies(),
  });

  const updateSiteCopyMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await axios.put(`/api/forge/site-copy/${key}`, { value });
    },
    onSuccess: () => {
      setEditingCopy(null);
    },
  });

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-8">The Forge — Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-dark-border">
          {['prayers', 'testimonies', 'content', 'site-copy'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 font-bold transition ${
                tab === t
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Prayers Tab */}
        {tab === 'prayers' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-surface p-4 rounded">
                <p className="text-gold text-2xl font-bold">{prayersData?.total || 0}</p>
                <p className="text-text-secondary">Total Prayers</p>
              </div>
              <div className="bg-surface p-4 rounded">
                <p className="text-red text-2xl font-bold">{prayersData?.crisis_count || 0}</p>
                <p className="text-text-secondary">Crisis Flags</p>
              </div>
              <div className="bg-surface p-4 rounded">
                <p className="text-gold text-2xl font-bold">{prayersData?.pending || 0}</p>
                <p className="text-text-secondary">Pending</p>
              </div>
            </div>

            <div className="space-y-4">
              {prayersData?.prayers.map((prayer: any) => (
                <div key={prayer.id} className="bg-surface p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-text-primary">{prayer.name || 'Anonymous'}</p>
                      {prayer.isCrisis && <p className="text-red text-sm font-bold">🚨 CRISIS</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deletePrayerMutation.mutate(prayer.id)}
                        className="bg-red text-dark px-3 py-1 rounded text-sm font-bold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-text-secondary mb-2">{prayer.request}</p>
                  <p className="text-text-secondary text-xs">
                    {new Date(prayer.created_at).toLocaleString()} • {prayer.prayerCount} prayers
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonies Tab */}
        {tab === 'testimonies' && (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-surface p-4 rounded">
                <p className="text-gold text-2xl font-bold">{testimoniesData?.total || 0}</p>
                <p className="text-text-secondary">Total</p>
              </div>
              <div className="bg-surface p-4 rounded">
                <p className="text-gold text-2xl font-bold">{testimoniesData?.approved || 0}</p>
                <p className="text-text-secondary">Approved</p>
              </div>
              <div className="bg-surface p-4 rounded">
                <p className="text-gold text-2xl font-bold">{testimoniesData?.pending || 0}</p>
                <p className="text-text-secondary">Pending</p>
              </div>
              <div className="bg-surface p-4 rounded">
                <p className="text-gold text-2xl font-bold">{testimoniesData?.featured || 0}</p>
                <p className="text-text-secondary">Featured</p>
              </div>
            </div>

            <div className="space-y-4">
              {testimoniesData?.testimonies.map((testimony: any) => (
                <div key={testimony.id} className="bg-surface p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-text-primary">{testimony.title}</p>
                      <p className="text-text-secondary text-sm">by {testimony.name}</p>
                    </div>
                    <div className="flex gap-2">
                      {!testimony.approved && (
                        <button
                          onClick={() => approveMutation.mutate({ id: testimony.id, approved: true })}
                          className="bg-gold text-dark px-3 py-1 rounded text-sm font-bold hover:bg-yellow-600"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => approveMutation.mutate({ id: testimony.id, approved: false })}
                        className="bg-dark-border text-text-secondary px-3 py-1 rounded text-sm font-bold hover:bg-dark"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm">{testimony.story.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Site Copy Tab */}
        {tab === 'site-copy' && (
          <div className="space-y-4">
            {siteCopyData?.map((item: any) => (
              <div key={item.key} className="bg-surface p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-gold">{item.key}</p>
                  {editingCopy?.key === item.key ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateSiteCopyMutation.mutate({
                            key: item.key,
                            value: editingCopy.value,
                          })
                        }
                        className="bg-gold text-dark px-3 py-1 rounded text-sm font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCopy(null)}
                        className="bg-dark-border text-text-secondary px-3 py-1 rounded text-sm font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingCopy({ key: item.key, value: item.value })}
                      className="bg-dark-border text-text-secondary px-3 py-1 rounded text-sm font-bold hover:bg-dark"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editingCopy?.key === item.key ? (
                  <textarea
                    value={editingCopy.value}
                    onChange={e => setEditingCopy({ ...editingCopy, value: e.target.value })}
                    className="w-full bg-dark-border text-text-primary px-3 py-2 rounded"
                    rows={3}
                  />
                ) : (
                  <p className="text-text-secondary">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
