import { useState } from 'react';
import ForgeText from '../components/ForgeText';

export default function FirstResponders() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', phone: '', narcan: 'no', available: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#e8e4dc',
      fontFamily: "'EB Garamond', 'Georgia', serif",
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{
          background: '#8B0000',
          padding: '16px 24px',
          marginBottom: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Crisis? Call or text 988 now — Suicide & Crisis Lifeline — Free, 24/7
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            Overdose → Call 911 immediately
          </div>
        </div>

        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#8B0000',
          marginBottom: 16,
        }}>
          First Responders
        </div>

        <ForgeText
          id="fr-title"
          tagName="h1"
          defaultText="There may be someone overdosing who needs Narcan right now within five miles of you."
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#fff',
            marginBottom: 32,
          }}
        />

        <div style={{ width: 60, height: 2, background: '#8B0000', marginBottom: 40 }} />

        <ForgeText
          id="fr-body"
          defaultText="Misfit Ministries First Responders are people who have been through it themselves. They carry Narcan. They show up. They don't judge. They are not social workers. They are not a hotline. They are soldiers who know what the dark looks like from the inside and chose to be available for the person behind them."
          style={{
            fontSize: '1.2rem',
            lineHeight: 2,
            color: '#ccc',
            display: 'block',
            marginBottom: 60,
          }}
        />

        <div style={{
          border: '1px solid #1a1a1a',
          padding: '48px 40px',
          background: '#0d0d0d',
        }}>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8B0000',
            marginBottom: 32,
          }}>
            Register as a First Responder
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 16 }}>You're in the unit.</p>
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: 1.8 }}>
                We'll reach out. What you just did matters more than you know.
              </p>
            </div>
          ) : (
            <div>
              {[
                { name: 'name', placeholder: 'Your name', type: 'text' },
                { name: 'location', placeholder: 'City, State (so we can map you)', type: 'text' },
                { name: 'phone', placeholder: 'Phone number (kept private)', type: 'tel' },
              ].map(field => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: '#0a0a0a',
                    border: '1px solid #222',
                    color: '#e8e4dc',
                    padding: '14px 16px',
                    fontFamily: 'EB Garamond, Georgia, serif',
                    fontSize: '1.1rem',
                    outline: 'none',
                    marginBottom: 16,
                    display: 'block',
                  }}
                />
              ))}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: 8 }}>
                  Do you carry Narcan?
                </label>
                <select
                  name="narcan"
                  value={form.narcan}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: '#0a0a0a',
                    border: '1px solid #222',
                    color: '#e8e4dc',
                    padding: '14px 16px',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                >
                  <option value="no">No — but I'm willing to get trained</option>
                  <option value="yes">Yes — I carry it</option>
                  <option value="trained">I'm trained but don't carry currently</option>
                </select>
              </div>

              <textarea
                name="available"
                placeholder="When are you generally available? (nights, weekends, anytime...)"
                value={form.available}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%',
                  background: '#0a0a0a',
                  border: '1px solid #222',
                  color: '#e8e4dc',
                  padding: '14px 16px',
                  fontFamily: 'EB Garamond, Georgia, serif',
                  fontSize: '1.1rem',
                  outline: 'none',
                  marginBottom: 24,
                  resize: 'vertical',
                  display: 'block',
                }}
              />

              <button
                onClick={() => setSubmitted(true)}
                className="btn-primary"
                style={{ width: '100%', cursor: 'pointer', border: 'none' }}
              >
                I'm In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
