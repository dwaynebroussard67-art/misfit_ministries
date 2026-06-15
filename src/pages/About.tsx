import ForgeText from '../components/ForgeText';
import ForgeImage from '../components/ForgeImage';

export default function About() {
  return (
    <div style={{ background: '#0a0a0a', color: '#e8e4dc', fontFamily: "'EB Garamond', 'Georgia', serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{ marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
          About
        </div>

        <ForgeText
          id="about-title"
          tagName="h1"
          defaultText="We didn't plan this. He did."
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 60 }}
        />

        <div style={{ width: 60, height: 2, background: '#8B0000', marginBottom: 60 }} />

        <ForgeText
          id="about-p1"
          defaultText="Misfit Ministries wasn't born in a boardroom. It wasn't born in a seminary. It was born at the edge of a fire, by people who had nothing left to lose and nowhere else to go, who fell on their knees and found out that was exactly the right posture to meet Him in."
          style={{ fontSize: '1.25rem', lineHeight: 2, color: '#ddd', display: 'block', marginBottom: 32 }}
        />

        <ForgeText
          id="about-p2"
          defaultText="The Iron Scribe founded this ministry not because he had it together, but because he didn't. Because every door the church closed, every time the comfortable people looked past him, every night the darkness tried to make the case that he was too far gone — he survived. And he decided that survival meant something. That it came with an obligation."
          style={{ fontSize: '1.25rem', lineHeight: 2, color: '#ddd', display: 'block', marginBottom: 32 }}
        />

        <ForgeText
          id="about-p3"
          defaultText="The obligation is this: go back. Go back for the ones still in it. Don't clean yourself up first. Don't wait until you have a building or a budget or a board of directors. Go back now, with whatever you have, and tell them the truth — that the Real One is still reaching into the fire, and He sent you to say so."
          style={{ fontSize: '1.25rem', lineHeight: 2, color: '#ddd', display: 'block', marginBottom: 60 }}
        />

        <div style={{ borderLeft: '3px solid #8B0000', paddingLeft: 32, marginBottom: 60 }}>
          <ForgeText
            id="about-khuba"
            tagName="blockquote"
            defaultText="ܚܘܒܐ — Khuba. Not the word they softened into something you could put on a greeting card. The Aramaic word. The active word. Love as force. Love as movement. Love as something that gets up and walks toward the thing everyone else is walking away from."
            style={{ fontSize: '1.3rem', lineHeight: 1.9, color: '#ccc', fontStyle: 'italic' }}
          />
        </div>

        <ForgeImage
          slotId="about-hero"
          alt="Misfit Ministries"
          style={{ width: '100%', height: 400, objectFit: 'cover', filter: 'brightness(0.7)', marginBottom: 60 } as React.CSSProperties}
        />

        <ForgeText
          id="about-close"
          defaultText="This is not a denomination. This is not a brand. This is a unit. And if you've read this far, you already know whether you're in or not."
          style={{ fontSize: '1.4rem', lineHeight: 1.9, color: '#fff', fontStyle: 'italic' }}
        />
      </div>
    </div>
  );
}
