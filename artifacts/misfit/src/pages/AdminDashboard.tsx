import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { ResponsiveLayout, ResponsiveCard } from '../components/ResponsiveLayout';

interface DashboardStats {
  totalPrayers: number;
  crisisPrayers: number;
  totalTestimonies: number;
  totalResponders: number;
  activeResponders: number;
  totalNarcan: number;
  distributedNarcan: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', timeRange],
    queryFn: async () => {
      const res = await axios.get(`/api/analytics?range=${timeRange}`);
      return res.data as DashboardStats;
    },
  });

  const { data: prayerTrend } = useQuery({
    queryKey: ['prayer-trend', timeRange],
    queryFn: async () => {
      const res = await axios.get(`/api/analytics/prayers/trend?range=${timeRange}`);
      return res.data;
    },
  });

  const { data: narcanDistribution } = useQuery({
    queryKey: ['narcan-distribution'],
    queryFn: async () => {
      const res = await axios.get('/api/narcan-supply-chain/distribution');
      return res.data;
    },
  });

  return (
    <ResponsiveLayout>
      <div className=\"space-y-6\">
        {/* Header */}
        <div className=\"flex flex-col md:flex-row justify-between items-start md:items-center gap-4\">
          <div>
            <h1 className=\"text-3xl md:text-5xl font-bold text-gold mb-2\">Admin Dashboard</h1>
            <p className=\"text-text-secondary text-sm md:text-base\">Real-time platform metrics</p>
          </div>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as any)}
            className=\"bg-surface border border-dark-border text-text-primary px-4 py-2 rounded font-bold\"
          >
            <option value=\"24h\">Last 24 Hours</option>
            <option value=\"7d\">Last 7 Days</option>
            <option value=\"30d\">Last 30 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4\">
          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Total Prayers</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">{stats?.totalPrayers || 0}</p>
            <p className=\"text-red text-xs md:text-sm mt-1\">
              {stats?.crisisPrayers || 0} crisis
            </p>
          </ResponsiveCard>

          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Testimonies</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">{stats?.totalTestimonies || 0}</p>
          </ResponsiveCard>

          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Active Responders</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">{stats?.activeResponders || 0}</p>
            <p className=\"text-text-secondary text-xs md:text-sm mt-1\">
              of {stats?.totalResponders || 0}
            </p>
          </ResponsiveCard>

          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Revenue</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">
              ${((stats?.totalRevenue || 0) / 100).toFixed(0)}
            </p>
            <p className=\"text-text-secondary text-xs md:text-sm mt-1\">
              {stats?.totalOrders || 0} orders
            </p>
          </ResponsiveCard>
        </div>

        {/* Narcan Distribution */}
        <ResponsiveCard>
          <h2 className=\"text-xl font-bold text-gold mb-4\">Narcan Distribution</h2>
          <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4\">
            <div>
              <p className=\"text-text-secondary text-sm mb-1\">Total Kits</p>
              <p className=\"text-2xl font-bold text-gold\">{stats?.totalNarcan || 0}</p>
            </div>
            <div>
              <p className=\"text-text-secondary text-sm mb-1\">Distributed</p>
              <p className=\"text-2xl font-bold text-green-500\">{stats?.distributedNarcan || 0}</p>
            </div>
            <div>
              <p className=\"text-text-secondary text-sm mb-1\">Pending</p>
              <p className=\"text-2xl font-bold text-yellow-500\">
                {(stats?.totalNarcan || 0) - (stats?.distributedNarcan || 0)}
              </p>
            </div>
          </div>

          {/* Distribution Progress Bar */}
          <div className=\"mt-4\">
            <div className=\"bg-dark-border rounded-full h-4 overflow-hidden\">
              <div
                className=\"bg-green-500 h-full transition-all\"
                style={{
                  width: `${((stats?.distributedNarcan || 0) / (stats?.totalNarcan || 1)) * 100}%`,
                }}
              />
            </div>
            <p className=\"text-text-secondary text-xs mt-2\">
              {stats?.totalNarcan
                ? Math.round(((stats.distributedNarcan || 0) / stats.totalNarcan) * 100)
                : 0}% distributed
            </p>
          </div>
        </ResponsiveCard>

        {/* Prayer Trend Chart (ASCII) */}
        <ResponsiveCard>
          <h2 className=\"text-xl font-bold text-gold mb-4\">Prayer Submissions Trend</h2>
          <div className=\"space-y-2 text-sm\">
            {prayerTrend?.map((item: any, i: number) => (
              <div key={i} className=\"flex items-center gap-2\">
                <span className=\"text-text-secondary w-16\">{item.date}</span>
                <div className=\"flex-1 bg-dark-border rounded h-6 flex items-center\">
                  <div
                    className=\"bg-gold h-full rounded transition-all\"
                    style={{
                      width: `${Math.min((item.count / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className=\"text-gold font-bold w-8 text-right\">{item.count}</span>
              </div>
            ))}
          </div>
        </ResponsiveCard>

        {/* Quick Actions */}
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
          <ResponsiveCard className=\"bg-gold/10 border-gold/50\">
            <p className=\"font-bold text-gold mb-2\">📋 Moderate Prayers</p>
            <p className=\"text-text-secondary text-sm mb-3\">Review and approve pending prayers</p>
            <a
              href=\"/forge\"
              className=\"text-gold font-bold hover:underline text-sm\"
            >
              Go to Forge →
            </a>
          </ResponsiveCard>

          <ResponsiveCard className=\"bg-gold/10 border-gold/50\">
            <p className=\"font-bold text-gold mb-2\">📦 Manage Shipments</p>
            <p className=\"text-text-secondary text-sm mb-3\">Track Narcan distribution</p>
            <a
              href=\"/narcan-supply-chain\"
              className=\"text-gold font-bold hover:underline text-sm\"
            >
              View Supply Chain →
            </a>
          </ResponsiveCard>

          <ResponsiveCard className=\"bg-gold/10 border-gold/50\">
            <p className=\"font-bold text-gold mb-2\">📊 View Audit Logs</p>
            <p className=\"text-text-secondary text-sm mb-3\">Track all admin actions</p>
            <a
              href=\"/audit-logs\"
              className=\"text-gold font-bold hover:underline text-sm\"
            >
              View Logs →
            </a>
          </ResponsiveCard>
        </div>
      </div>
    </ResponsiveLayout>
  );
}

