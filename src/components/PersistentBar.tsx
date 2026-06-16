import { useState } from 'react';
import { Link } from 'react-router-dom';
// import NuraChat from './NuraChat';

export default function PersistentBar() {
  const [nuraOpen, setNuraOpen] = useState(false);

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        display: 'flex',
        gap: 2,
        background: '#0a0a0a',
        borderTop: '1px solid #1a1a1a',
      }}>
        <button
          onClick={() => setNuraOpen(prev => !prev)}
          style={{
            flex: 1,
            padding: '14px 16px',
            background: nuraOpen ? '#8B0000' : '#0d0d0d',
            border: 'none',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: '0.8rem' }}>✦</span>
          Talk to Nura
        </button>

        <Link
          to="/first-responders"
          style={{
            flex: 1,
            padding: '14px 16px',
            background: '#8B0000',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>⚡</span>
          First Responders
        </Link>
      </div>

      {nuraOpen && (
        <div style={{
          position: 'fixed',
          bottom: 52,
          left: 0,
          right: 0,
          zIndex: 299,
          maxWidth: 600,
          margin: '0 auto',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.8)',
        }}>
          {/* <NuraChat /> */}
        </div>
      )}

      <div style={{ height: 52 }} />
    </>
  );
}
