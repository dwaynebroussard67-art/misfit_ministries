import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  email: string;
  text: string;
  time: string;
  comments: Comment[];
  flagged?: boolean;
}

const BANNED_PATTERNS = [
  /\bhate\b/i, /\bkill yourself\b/i, /\bstupid\b/i, /\bidiot\b/i,
  /\bworthless\b/i, /\bnobody cares\b/i, /\bgo die\b/i,
];

function isFlagged(text: string): boolean {
  return BANNED_PATTERNS.some(p => p.test(text));
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: 'p1',
    author: 'Anonymous Misfit',
    email: '',
    text: "Found this place at 2am. Don't know why I'm still here but I am. Reading the Notes from the King right now and I can't stop.",
    time: new Date(Date.now() - 3600000 * 2).toISOString(),
    comments: [
      { id: 'c1', author: 'Another Misfit', text: "You're supposed to be here. Keep reading.", time: new Date(Date.now() - 3600000).toISOString() },
    ],
  },
  {
    id: 'p2',
    author: 'Anonymous Misfit',
    email: '',
    text: "14 months clean. First time I've said that out loud anywhere. This place feels like the first honest room I've been in.",
    time: new Date(Date.now() - 3600000 * 5).toISOString(),
    comments: [],
  },
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('misfit-community');
      return saved ? JSON.parse(saved) : SAMPLE_POSTS;
    } catch { return SAMPLE_POSTS; }
  });

  const [name, setName] = useState('');
  const [postText, setPostText] = useState('');
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [emailGiven, setEmailGiven] = useState(() => !!localStorage.getItem('misfit-community-email'));
  const [emailInput, setEmailInput] = useState('');
  const [emailStep, setEmailStep] = useState(false);
  const [pendingPost, setPendingPost] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [nuraNote, setNuraNote] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('misfit-community', JSON.stringify(posts));
  }, [posts]);

  function submitPost() {
    if (!postText.trim()) return;
    if (!emailGiven) {
      setPendingPost(postText);
      setPendingName(name);
      setEmailStep(true);
      return;
    }
    addPost(postText, name);
  }

  function giveEmail() {
    if (!emailInput.includes('@')) return;
    localStorage.setItem('misfit-community-email', emailInput);
    setEmailGiven(true);
    setEmailStep(false);
    if (pendingPost) {
      addPost(pendingPost, pendingName);
      setPendingPost('');
      setPendingName('');
    }
  }

  function addPost(text: string, author: string) {
    if (isFlagged(text)) {
      setNuraNote("Nura removed that post. This is a safe space. If you're hurting, talk to her directly.");
      setTimeout(() => setNuraNote(null), 5000);
      setPostText('');
      return;
    }
    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: author.trim() || 'Anonymous Misfit',
      email: '',
      text: text.trim(),
      time: new Date().toISOString(),
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setPostText('');
    setName('');
  }

  function addComment(postId: string) {
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    if (isFlagged(text)) {
      setNuraNote("Nura removed that comment. Speak to one another the way you'd want to be spoken to.");
      setTimeout(() => setNuraNote(null), 5000);
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      return;
    }
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, {
        id: `c-${Date.now()}`,
        author: 'Anonymous Misfit',
        text,
        time: new Date().toISOString(),
      }],
    } : p));
    setCommentTexts(prev => ({ ...prev, [postId]: '' }));
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #1a1a1a',
    color: '#e8e4dc',
    padding: '12px 16px',
    fontFamily: 'EB Garamond, Georgia, serif',
    fontSize: '1rem',
    outline: 'none',
    display: 'block',
    marginBottom: 10,
  };

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#e8e4dc',
      fontFamily: "'EB Garamond', 'Georgia', serif",
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 32px 100px' }}>

        <div style={{ marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
          The Community
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
          You're not alone in this.
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, marginBottom: 48 }}>
          This space is governed by Nura. Speak to one another the way you needed someone to speak to you when you were at the bottom. No judgment. No hatred. No weapons. Just Misfits.
        </p>

        {nuraNote && (
          <div style={{
            background: '#0d0d0d',
            borderLeft: '3px solid #8B0000',
            padding: '14px 20px',
            marginBottom: 24,
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.75rem',
            color: '#cc2200',
          }}>
            ✦ Nura: {nuraNote}
          </div>
        )}

        {emailStep && (
          <div style={{
            background: '#0d0d0d',
            border: '1px solid #1a1a1a',
            padding: '32px',
            marginBottom: 32,
          }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 16 }}>
              One step to post
            </div>
            <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.8, marginBottom: 20 }}>
              Drop your email. That's the door. We don't sell it. We don't spam it. It's just yours and ours.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && giveEmail()}
              style={inputStyle}
            />
            <button onClick={giveEmail} className="btn-primary" style={{ cursor: 'pointer', border: 'none' }}>
              I'm In
            </button>
          </div>
        )}

        {!emailStep && (
          <div style={{ marginBottom: 48, background: '#0d0d0d', border: '1px solid #1a1a1a', padding: 24 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: 16 }}>
              Say something
            </div>
            <input
              placeholder="Name (optional — you can stay anonymous)"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...inputStyle, fontSize: '0.9rem' }}
            />
            <textarea
              placeholder="What's on your heart..."
              value={postText}
              onChange={e => setPostText(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <button
              onClick={submitPost}
              disabled={!postText.trim()}
              className="btn-ghost"
              style={{ cursor: postText.trim() ? 'pointer' : 'default', opacity: postText.trim() ? 1 : 0.4 }}
            >
              Post
            </button>
          </div>
        )}

        <div>
          {posts.map(post => (
            <div key={post.id} style={{
              marginBottom: 40,
              paddingBottom: 40,
              borderBottom: '1px solid #111',
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#8B0000', letterSpacing: '0.08em' }}>
                    {post.author}
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.6rem', color: '#333' }}>
                    {timeAgo(post.time)}
                  </span>
                </div>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.85, color: '#ccc', margin: 0 }}>
                  {post.text}
                </p>
              </div>

              {post.comments.length > 0 && (
                <div style={{ paddingLeft: 20, borderLeft: '1px solid #1a1a1a', marginBottom: 16 }}>
                  {post.comments.map(c => (
                    <div key={c.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', color: '#555' }}>{c.author}</span>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.6rem', color: '#2a2a2a' }}>{timeAgo(c.time)}</span>
                      </div>
                      <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#888', margin: 0 }}>{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="Reply..."
                  value={commentTexts[post.id] || ''}
                  onChange={e => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                  style={{
                    flex: 1,
                    background: '#0d0d0d',
                    border: '1px solid #111',
                    color: '#e8e4dc',
                    padding: '10px 14px',
                    fontFamily: 'EB Garamond, Georgia, serif',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => addComment(post.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #222',
                    color: '#555',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40,
          padding: '20px 24px',
          background: '#0d0d0d',
          borderLeft: '2px solid #8B0000',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: '1rem', color: '#8B0000' }}>✦</span>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', color: '#444', letterSpacing: '0.08em' }}>
            Nura is present in this space. She watches over every word. Speak like you mean it.
          </span>
        </div>

      </div>
    </div>
  );
}
