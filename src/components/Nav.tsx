import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const links = [
    { to: '/home', label: 'Front Lines' },
    { to: '/war-room', label: 'War Room' },
    { to: '/notes-from-the-king', label: 'Notes from the King' },
    { to: '/thats-what-love-does', label: "That's What Love Does" },
    { to: '/armory', label: 'Armory' },
    { to: '/about', label: 'About' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Misfit Ministries</Link>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
          ))}
        </ul>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none', border: 'none', color: '#fff',
            fontSize: '1.5rem', cursor: 'pointer', padding: 4,
          }}
          className="nav-mobile-btn"
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10,10,10,0.98)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
          >✕</button>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/first-responders"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#8B0000',
              textDecoration: 'none',
              marginTop: 16,
            }}
          >
            First Responders
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
