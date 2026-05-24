import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';
import Layout from '../components/Layout';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  lastLogin?: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-400">{error || 'User not found'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark to-dark/80 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded text-red-200 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-dark-secondary border border-gold/20 rounded-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="bg-gold/20 p-4 rounded-lg">
                <User size={40} className="text-gold" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{user.name}</h2>
                <p className="text-text-secondary mb-4">{user.email}</p>
                
                {/* Role Badge */}
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-gold" />
                  <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-semibold capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prayer Wall */}
            <button
              onClick={() => navigate('/prayer')}
              className="bg-dark-secondary border border-gold/20 hover:border-gold/50 rounded-lg p-6 text-left transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              <h3 className="text-xl font-bold text-gold mb-2">Prayer Wall</h3>
              <p className="text-text-secondary">Submit a prayer request or view community prayers</p>
            </button>

            {/* Testimonies */}
            <button
              onClick={() => navigate('/testimonies')}
              className="bg-dark-secondary border border-gold/20 hover:border-gold/50 rounded-lg p-6 text-left transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              <h3 className="text-xl font-bold text-gold mb-2">Testimonies</h3>
              <p className="text-text-secondary">Share your story or read others' journeys</p>
            </button>

            {/* Nura AI */}
            <button
              onClick={() => navigate('/nura')}
              className="bg-dark-secondary border border-gold/20 hover:border-gold/50 rounded-lg p-6 text-left transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              <h3 className="text-xl font-bold text-gold mb-2">Talk to Nura</h3>
              <p className="text-text-secondary">Chat with our AI companion for guidance</p>
            </button>

            {/* Resources */}
            <button
              onClick={() => navigate('/wreckage')}
              className="bg-dark-secondary border border-gold/20 hover:border-gold/50 rounded-lg p-6 text-left transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              <h3 className="text-xl font-bold text-gold mb-2">Crisis Resources</h3>
              <p className="text-text-secondary">Access 24/7 help and support services</p>
            </button>
          </div>

          {/* Admin Panel Link */}
          {(user.role === 'admin' || user.role === 'moderator') && (
            <div className="mt-8 p-6 bg-gold/10 border border-gold/30 rounded-lg">
              <button
                onClick={() => navigate('/forge')}
                className="w-full px-6 py-3 bg-gold text-dark font-bold rounded hover:bg-gold/90 transition-colors"
              >
                Go to Admin Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
