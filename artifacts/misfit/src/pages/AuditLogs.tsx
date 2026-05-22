import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { ResponsiveLayout, ResponsiveCard } from '../components/ResponsiveLayout';

export default function AuditLogs() {
  const [filter, setFilter] = useState<'all' | 'prayer' | 'testimony' | 'content'>('all');
  const [adminFilter, setAdminFilter] = useState('');

  const { data: logs } = useQuery({
    queryKey: ['audit-logs', filter, adminFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('entityType', filter);
      if (adminFilter) params.append('adminEmail', adminFilter);
      const res = await axios.get(`/api/audit-logs?${params}`);
      return res.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['audit-stats'],
    queryFn: async () => {
      const res = await axios.get('/api/audit-logs/stats');
      return res.data;
    },
  });

  return (
    <ResponsiveLayout>
      <div className=\"space-y-6\">
        {/* Header */}
        <div>
          <h1 className=\"text-3xl md:text-5xl font-bold text-gold mb-2\">Audit Logs</h1>
          <p className=\"text-text-secondary text-sm md:text-base\">Track all admin actions and changes</p>
        </div>

        {/* Stats */}
        <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4\">
          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Total Actions</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">{stats?.totalActions || 0}</p>
          </ResponsiveCard>
          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Admins</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">
              {stats?.byAdmin ? Object.keys(stats.byAdmin).length : 0}
            </p>
          </ResponsiveCard>
          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Action Types</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">
              {stats?.byAction ? Object.keys(stats.byAction).length : 0}
            </p>
          </ResponsiveCard>
          <ResponsiveCard>
            <p className=\"text-text-secondary text-xs md:text-sm\">Entity Types</p>
            <p className=\"text-2xl md:text-3xl font-bold text-gold\">
              {stats?.byEntityType ? Object.keys(stats.byEntityType).length : 0}
            </p>
          </ResponsiveCard>
        </div>

        {/* Filters */}
        <div className=\"bg-surface p-4 md:p-6 rounded-lg space-y-4\">
          <h2 className=\"font-bold text-gold\">Filters</h2>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div>
              <label className=\"block text-text-secondary text-sm mb-2\">Entity Type</label>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value as any)}
                className=\"w-full bg-dark-border text-text-primary px-3 py-2 rounded text-sm md:text-base\"
              >
                <option value=\"all\">All</option>
                <option value=\"prayer\">Prayers</option>
                <option value=\"testimony\">Testimonies</option>
                <option value=\"content\">Content</option>
              </select>
            </div>
            <div>
              <label className=\"block text-text-secondary text-sm mb-2\">Admin Email</label>
              <input
                type=\"email\"
                value={adminFilter}
                onChange={e => setAdminFilter(e.target.value)}
                placeholder=\"Filter by admin...\"
                className=\"w-full bg-dark-border text-text-primary px-3 py-2 rounded text-sm md:text-base\"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className=\"overflow-x-auto\">
          <table className=\"w-full text-sm md:text-base\">
            <thead>
              <tr className=\"bg-surface border-b border-dark-border\">
                <th className=\"px-3 md:px-4 py-2 md:py-3 text-left text-gold font-bold\">Time</th>
                <th className=\"px-3 md:px-4 py-2 md:py-3 text-left text-gold font-bold\">Admin</th>
                <th className=\"px-3 md:px-4 py-2 md:py-3 text-left text-gold font-bold\">Action</th>
                <th className=\"px-3 md:px-4 py-2 md:py-3 text-left text-gold font-bold\">Entity</th>
                <th className=\"px-3 md:px-4 py-2 md:py-3 text-left text-gold font-bold\">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((log: any, i: number) => (
                <tr key={i} className=\"border-b border-dark-border hover:bg-dark-border/50\">
                  <td className=\"px-3 md:px-4 py-2 md:py-3 text-text-secondary text-xs md:text-sm\">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className=\"px-3 md:px-4 py-2 md:py-3 text-text-primary text-xs md:text-sm\">
                    {log.admin_email}
                  </td>
                  <td className=\"px-3 md:px-4 py-2 md:py-3\">
                    <span className=\"bg-gold/20 text-gold px-2 py-1 rounded text-xs md:text-sm font-bold\">
                      {log.action}
                    </span>
                  </td>
                  <td className=\"px-3 md:px-4 py-2 md:py-3 text-text-secondary text-xs md:text-sm\">
                    {log.entity_type}#{log.entity_id}
                  </td>
                  <td className=\"px-3 md:px-4 py-2 md:py-3 text-text-secondary text-xs md:text-sm\">
                    {log.reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ResponsiveLayout>
  );
}

