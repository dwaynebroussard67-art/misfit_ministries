import { useState } from 'react';
import ForgeText from '../components/ForgeText';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.name || !form.message) return;
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0d0d0d', border: '1px solid #222',
    color: '#e8e4dc', padding: '14px 16px',
    fontFamily: 'EB Garamond, Georgia, serif', fontSize: '1.1rem',
    outline: 'none', marginBottom: 16,
  };

  return (
    <div style={{ background: '#0a0a0a', color: '#e8e4dc', fontFamily: "'EB Garamond', 'Georgia', serif", minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{ marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
          Contact
        </div>

        <ForgeText
          id="contact-title"
          tagName="h1"
          defaultText="Say something."
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 16 }}
        />

        <ForgeText
          id="contact-sub"
          defaultText="Prayer request, question, testimony, or just needing to talk to a human being — we're here. We read everything."
          style={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#777', display: 'block', marginBottom: 60 }}
        />

        {sent ? (
          <div style={{ padding: 40, border: '1px solid #8B0000', textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 16 }}>We got it.</p>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Someone will be back with you. You didn't send this into the void.</p>
          </div>
        ) : (
          <div>
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="email"
              type="email"
              placeholder="Your email (optional)"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
            <textarea
              name="message"
              placeholder="Say what you need to say."
              value={form.message}
              onChange={handleChange}
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ width: '100%', cursor: 'pointer', border: 'none' }}
            >
              Send It
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
