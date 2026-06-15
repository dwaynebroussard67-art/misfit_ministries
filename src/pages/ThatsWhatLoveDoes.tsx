import { Link } from 'react-router-dom';
import ForgeText from '../components/ForgeText';

const chapters = [
  {
    num: '01',
    title: 'The Burning Action',
    sub: 'Khuba — what love actually is',
    body: `In the language Jesus spoke, love is not a feeling. It is Khuba — a burning debt. It means you do the right thing because the love in you requires it, not because the other person earned it. It is a one-way street with no exit ramp.

This is what dismantles the Hallmark version. Love as Khuba moves. It shows up at 3am. It stays when the person is ugly in their pain. It tells the truth even when the truth costs something. This is what Iyesus demonstrated. This is what He requires.`,
  },
  {
    num: '02',
    title: 'The Covenant of the Trench',
    sub: 'What it costs to love the way He loved',
    body: `True love is a symmetrical death. Both people lay down their lives. Not alternating. Not transactional. Simultaneously. "I no longer exist — only we exist for the King."

This is the covenant the world cannot sell you because it cannot survive without an exit strategy. The Code of Misfit Ministries — Trust, Love, Respect, Honesty — is the soil this grows in. Pull any one of the four and the ground goes soft.`,
  },
  {
    num: '03',
    title: 'The Forgiveness Arc',
    sub: 'Going to the person who does not deserve it',
    body: `I went to my father after everything he did. I went to forgive him. He rejected me anyway.

This is the testimony that proves Khuba is real — because I did not go for him. I went because the love of Jesus in me required the burning away of my own bitterness to make room for His peace. The result was in God's hands. The going was in mine.

A seed has to crack open and die in the dark dirt before it can grow. The rejection was the dark place. What came out of it was this.`,
  },
  {
    num: '04',
    title: 'The Rebirthday',
    sub: 'January 12th — what it means to be born again in the original sense',
    body: `The Western church domesticated "born again" into a prayer and a handshake. The Aramaic reality is violent. It is a complete dissolution of the old life. Everything that was you — every defense, every mask, every survival mechanism — surrenders.

January 12th was the day the seed cracked open. Thirty days of rehab. The burning away of everything that wasn't Him. What came out the other side was not a better version of me. It was the version He always intended.`,
  },
  {
    num: '05',
    title: 'The Misfit Mandate',
    sub: 'What survival obligates you to do',
    body: `You did not survive so you could be comfortable. You survived so you could go back.

Every Misfit who makes it out carries an obligation to the ones still in it. Not a suggestion. Not a calling you can decline. A mandate. The same mandate that sent Jesus into Sheol. The same mandate that sent the Iron Scribe into everything that built this ministry.

That's what love does. It goes back. Every time.`,
  },
];

export default function ThatsWhatLoveDoes() {
  return (
    <div style={{
      background: '#0a0a0a',
      color: '#e8e4dc',
      fontFamily: "'EB Garamond', 'Georgia', serif",
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 16 }}>
          That's What Love Does
        </div>

        <ForgeText
          id="twld-title"
          tagName="h1"
          defaultText="The book the ministry was born to write."
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 32 }}
        />

        <div style={{ width: 60, height: 2, background: '#8B0000', marginBottom: 40 }} />

        <ForgeText
          id="twld-intro-1"
          defaultText="In the Aramaic language of Jesus, love isn't a choice you make when you feel good. It is Khuba — a debt of the soul that moves before you decide to move, that stays before you decide to stay, that forgives before the person across from you has done anything to deserve it."
          style={{ fontSize: '1.3rem', lineHeight: 2, color: '#ddd', display: 'block', marginBottom: 24 }}
        />

        <ForgeText
          id="twld-intro-2"
          defaultText="This book is for the ones who have been burned by love that had conditions. For the ones who gave everything and got rejection back. For the ones who know what it costs to survive a night that was trying to kill them and still woke up the next morning with something left to give."
          style={{ fontSize: '1.3rem', lineHeight: 2, color: '#ddd', display: 'block', marginBottom: 24 }}
        />

        <ForgeText
          id="twld-intro-3"
          defaultText="This is not self-help. This is testimony. The difference is that self-help tells you what to do. Testimony tells you what it actually costs — and proves it can be survived."
          style={{ fontSize: '1.3rem', lineHeight: 2, color: '#999', display: 'block', fontStyle: 'italic' }}
        />
      </div>

      <div style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '80px 0', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#333', marginBottom: 60, textAlign: 'center' }}>
            The Architecture
          </div>

          {chapters.map((ch, i) => (
            <div key={ch.num} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 40px', marginBottom: 60, paddingBottom: 60, borderBottom: i < chapters.length - 1 ? '1px solid #111' : 'none' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1, paddingTop: 4 }}>
                {ch.num}
              </div>
              <div>
                <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  {ch.title}
                </h2>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', color: '#8B0000', marginBottom: 20, textTransform: 'uppercase' }}>
                  {ch.sub}
                </div>
                {ch.body.split('\n\n').map((para, j) => (
                  <p key={j} style={{ fontSize: '1.1rem', lineHeight: 1.9, color: '#888', marginBottom: 16 }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, marginBottom: 80 }}>
          {['Trust', 'Love', 'Respect', 'Honesty'].map(word => (
            <div key={word} style={{ background: '#0d0d0d', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
                {word}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderLeft: '3px solid #8B0000', paddingLeft: 32, marginBottom: 80 }}>
          <ForgeText
            id="twld-code"
            defaultText="At Misfit Ministries, we don't follow the world's version of love. We follow The Code: Trust, Love, Respect, and Honesty. These aren't feelings. They are the soil the seed grows in. Pull any one of them and the ground goes soft under everything you've built."
            style={{ fontSize: '1.2rem', lineHeight: 1.9, color: '#ccc', fontStyle: 'italic' }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/war-room" className="btn-primary">
            Enter the War Room
          </Link>
        </div>
      </div>
    </div>
  );
}
