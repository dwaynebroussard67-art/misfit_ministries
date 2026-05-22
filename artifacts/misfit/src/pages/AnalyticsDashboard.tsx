import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function AnalyticsDashboard() {
  const [tab, setTab] = useState<'overview' | 'prayers' | 'store' | 'narcan'>('overview');

  const { data: dashboardData } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const res = await axios.get('/api/analytics/dashboard');
      return res.data;
    },
  });

  const { data: prayerData } = useQuery({
    queryKey: ['analytics-prayers'],
    queryFn: async () => {
      const res = await axios.get('/api/analytics/prayers');
      return res.data;
    },
  });

  const { data: storeData } = useQuery({
    queryKey: ['analytics-store'],
    queryFn: async () => {
      const res = await axios.get('/api/analytics/store');
      return res.data;
    },
  });

  const { data: narcanData } = useQuery({
    queryKey: ['analytics-narcan'],
    queryFn: async () => {
      const res = await axios.get('/api/analytics/narcan');
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">Analytics Dashboard</h1>
          <p className="text-2xl text-text-secondary">Real-time insights into Misfit Ministries impact.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-dark-border">
          {['overview', 'prayers', 'store', 'narcan'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 font-bold transition ${
                tab === t
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div>
            {/* Prayer Stats */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-4">Prayers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Prayers"
                  value={dashboardData?.prayers.total || 0}
                  color="gold"
                />
                <StatCard
                  label="This Month"
                  value={dashboardData?.prayers.thisMonth || 0}
                  color="gold"
                />
                <StatCard
                  label="Crisis Flags"
                  value={dashboardData?.prayers.crisis || 0}
                  color="red"
                />
              </div>
            </div>

            {/* Testimony Stats */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-4">Testimonies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Testimonies"
                  value={dashboardData?.testimonies.total || 0}
                  color="gold"
                />
                <StatCard
                  label="This Month"
                  value={dashboardData?.testimonies.thisMonth || 0}
                  color="gold"
                />
                <StatCard
                  label="Approved"
                  value={dashboardData?.testimonies.approved || 0}
                  color="green"
                />
              </div>
            </div>

            {/* Store Stats */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-4">Store</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Orders"
                  value={dashboardData?.orders.total || 0}
                  color="gold"
                />
                <StatCard
                  label="This Month"
                  value={dashboardData?.orders.thisMonth || 0}
                  color="gold"
                />
                <StatCard
                  label="Revenue"
                  value={`$${((dashboardData?.orders.revenue || 0) / 100).toFixed(2)}`}
                  color="green"
                />
              </div>
            </div>

            {/* Narcan Stats */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">Narcan Network</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Responders"
                  value={dashboardData?.responders.total || 0}
                  color="gold"
                />
                <StatCard
                  label="Active Responders"
                  value={dashboardData?.responders.active || 0}
                  color="green"
                />
                <StatCard
                  label="Narcan Kits"
                  value={dashboardData?.narcan.totalKits || 0}
                  color="gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Prayers Tab */}
        {tab === 'prayers' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Total Prayers: {prayerData?.total || 0}</h3>
                <p className="text-text-secondary">Crisis Flags: {prayerData?.crisis || 0}</p>
              </div>
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Prayers by Day</h3>
                {prayerData?.byDay && Object.entries(prayerData.byDay).slice(-7).map(([date, count]) => (
                  <div key={date} className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">{date}</span>
                    <span className="text-gold font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Store Tab */}
        {tab === 'store' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Total Orders</h3>
                <p className="text-4xl font-bold text-gold">{storeData?.totalOrders || 0}</p>
              </div>
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Total Revenue</h3>
                <p className="text-4xl font-bold text-green">${((storeData?.totalRevenue || 0) / 100).toFixed(2)}</p>
              </div>
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Average Order</h3>
                <p className="text-4xl font-bold text-gold">${((storeData?.averageOrderValue || 0) / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Narcan Tab */}
        {tab === 'narcan' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Narcan Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Total Kits</span>
                    <span className="text-gold font-bold">{narcanData?.totalKits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Distributed</span>
                    <span className="text-green font-bold">{narcanData?.distributedKits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Pending</span>
                    <span className="text-gold font-bold">{narcanData?.pendingKits || 0}</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-4">Responder Network</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Total Responders</span>
                    <span className="text-gold font-bold">{narcanData?.totalResponders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Active</span>
                    <span className="text-green font-bold">{narcanData?.activeResponders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Lives Saved</span>
                    <span className="text-gold font-bold">{narcanData?.totalSaves || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  const colorClass = color === 'gold' ? 'text-gold' : color === 'green' ? 'text-green' : 'text-red';

  return (
    <div className="bg-surface p-6 rounded-lg">
      <p className="text-text-secondary mb-2">{label}</p>
      <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
