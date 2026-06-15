import ForgeText from '../components/ForgeText';
import NuraChat from '../components/NuraChat';
import { Link } from 'react-router-dom';

export default function WarRoom() {
  return (
    <div style={{ background: '#0a0a0a', color: '#e8e4dc', fontFamily: "'EB Garamond', 'Georgia', serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{ marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
          War Room
        </div>

        <ForgeText
          id="warroom-title"
          tagName="h1"
          defaultText="This is where we fight."
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 60 }}
        />

        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 8 }}>
              Talk to Nura
            </div>
            <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.8, maxWidth: 560 }}>
              She was built by someone who came through the fire. She doesn't judge. She doesn't flinch. She meets you where you are.
            </p>
          </div>
          <NuraChat />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 80 }}>
          {[
            { id: 'wr-prayer', title: 'Prayer', body: 'Submit a prayer request. Every one gets seen. Every one gets prayed over. No request is too small or too dark.', link: '/contact' },
            { id: 'wr-teaching', title: 'Teaching', body: 'Raw, unfiltered theology. The kind they did not teach in Sunday school because it costs something to say it.', link: '/notes-from-the-king' },
            { id: 'wr-testimony', title: 'Testimony', body: 'The stories of the people who crawled in here and stood back up. Not polished. Not safe. Real.', link: '/contact' },
            { id: 'wr-first', title: 'First Responders', body: 'There may be someone overdosing who needs Narcan right now within five miles of you.', link: '/first-responders' },
          ].map(card => (
            <Link to={card.link} key={card.id} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #222', padding: 32, background: '#0d0d0d', height: '100%', transition: 'border-color 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#8B0000')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}
              >
                <ForgeText
                  id={`${card.id}-title`}
                  tagName="h3"
                  defaultText={card.title}
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 16 }}
                />
                <ForgeText
                  id={`${card.id}-body`}
                  defaultText={card.body}
                  style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#999' }}
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
