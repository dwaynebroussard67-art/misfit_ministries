import { useParams, Link } from 'react-router-dom';
import ForgeText from '../components/ForgeText';

const welcomeContent: Record<string, { title: string; sub: string; body: string[] }> = {
  addict: {
    title: "You Tried. Again. And Again.",
    sub: "To the one who's lost count of the attempts.",
    body: [
      "There is no number of relapses that disqualifies you from what He's offering. None. You don't have to show up clean. You don't have to show up with a thirty-day coin. You don't have to show up as anything other than exactly what you are right now.",
      "The people here know what withdrawal feels like. They know what it is to lie to everyone they love. They know the math of it — how you add up all the days clean and one night wipes the ledger. They know. And they're still here. Still standing. Still fighting.",
      "So are you, or you wouldn't be reading this. That's not nothing. That's everything.",
    ],
  },
  convict: {
    title: "The Church Said No. He Didn't.",
    sub: "To the one with a record and nowhere to go.",
    body: [
      "They dressed it up in scripture. Made it sound like grace, but there were conditions buried in the fine print. We know. We've seen it. Some of us lived it — walked out those gates with nothing and found every door closed, including the ones with crosses on them.",
      "This one isn't closed. It was built for you. The man this whole thing is founded on was executed by the state. He knows what it is to be processed, condemned, and thrown away. He knows what it is to have people walk past and not see you.",
      "He sees you. And so do we.",
    ],
  },
  atheist: {
    title: "You Don't Have to Believe Yet.",
    sub: "To the one who was burned by every version of God they were handed.",
    body: [
      "If the God you rejected was small, tribal, used as a weapon, or worshipped by people who didn't look anything like Him in how they lived — we understand why you walked. Honestly, so did we, at least from that version.",
      "We're not going to argue you into anything. We're not going to hit you with a tract. What we're going to do is be honest about what we've seen, what it cost us, and what changed. And then we're going to let you do whatever you want with that.",
      "The real one can handle your questions. He's not fragile. Come ask them.",
    ],
  },
  forgotten: {
    title: "He Was There. Even Then.",
    sub: "To the one who was supposed to be protected and wasn't.",
    body: [
      "What happened to you was not His plan. Not His will. Not His design. And the people who did it will answer for it — not on your timeline, but they will answer. That's not a platitude. That's a promise that was written before either of you existed.",
      "What He wants you to know — what He needs you to hear — is that He was there. In every room. In every night. He didn't look away. And He has been angry on your behalf every single day since.",
      "You don't have to perform healing here. You don't have to be okay. You just have to show up.",
    ],
  },
  veteran: {
    title: "You Carried What No One Else Would.",
    sub: "To the one who came home changed.",
    body: [
      "There are things you saw and did that this civilian world will never fully understand. And the people who sent you there moved on. Put out a ribbon. Shook your hand at the airport. And went back to their lives like the weight you came home with wasn't real.",
      "We're not going to pretend we understand what you carry. But we are going to stand next to you while you carry it. And we're going to tell you what we know — which is that the God of Armies is real, and He honors those who bled for something beyond themselves.",
      "Your brothers and sisters didn't die for nothing. And neither did you.",
    ],
  },
};

export default function Welcome() {
  const { type } = useParams<{ type: string }>();
  const content = welcomeContent[type ?? ''];

  if (!content) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8e4dc', fontFamily: 'EB Garamond, Georgia, serif', textAlign: 'center', padding: 32 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>You're in the right place.</h1>
          <Link to="/home" className="btn-ghost">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#e8e4dc', fontFamily: "'EB Garamond', 'Georgia', serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{ marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
          You belong here
        </div>

        <ForgeText
          id={`welcome-${type}-title`}
          tagName="h1"
          defaultText={content.title}
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 16 }}
        />

        <ForgeText
          id={`welcome-${type}-sub`}
          defaultText={content.sub}
          style={{ fontSize: '1.2rem', color: '#8B0000', fontStyle: 'italic', marginBottom: 60, display: 'block' }}
        />

        <div style={{ width: 60, height: 2, background: '#8B0000', marginBottom: 60 }} />

        {content.body.map((para, i) => (
          <ForgeText
            key={i}
            id={`welcome-${type}-p${i}`}
            defaultText={para}
            style={{ fontSize: '1.25rem', lineHeight: 2, color: '#ccc', display: 'block', marginBottom: 32 }}
          />
        ))}

        <div style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid #222', textAlign: 'center' }}>
          <p style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 40, fontStyle: 'italic' }}>
            "Their pain does not disqualify them. It is the very means by which they are qualified."
          </p>
          <Link to="/home" className="btn-primary">I'm Ready</Link>
        </div>
      </div>
    </div>
  );
}
