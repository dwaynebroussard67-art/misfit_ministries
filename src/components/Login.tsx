import { useState } from 'react';
import { supabase } from '../lib/supabase';
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: err } = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (err) setError(err.message);
    } catch (e) {
      setError('Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Misfit Ministries — Owner Login</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#c9a030', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => setIsSignup(!isSignup)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c9a030', textDecoration: 'underline' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
        </button>
      </p>
    </div>
  );
}
