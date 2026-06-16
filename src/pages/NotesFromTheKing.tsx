import { useState } from 'react';
import { useForge } from '../lib/ForgeContext';

const DEFAULT_NOTES = [
  {
    id: 'notk-1',
    title: 'The Great Exchange: Khuba and the King',
    content: `The name Jesus Christ and the word Khuba — True, Sacrificial Love — are one and the same. In every sentence, prayer, and breath of this ministry, you may exchange His name for Love and the truth remains unchanged. He is the definition, the source, and the Word.

This is not poetry. This is load-bearing theology. If you pull Khuba out of Misfit Ministries, the whole structure collapses because there is nothing left to hold it up. He is not the decoration. He is the foundation.`,
    ref: 'John 1:1 / Aramaic: Khuba',
  },
  {
    id: 'notk-2',
    title: 'The Infinite Seed',
    content: `Infinity divided by infinity is still infinity.

At conception, Jesus places a piece of Himself in us. This Seed remains dormant until we surrender. Because any piece of infinity is still infinite, even a mustard seed of faith has the power to move mountains.

The devil tries to suffocate this seed so you never realize you have Infinity walking around inside you. That is his only strategy. He cannot destroy what the King planted. He can only try to convince you it was never there.

It was always there. It is still there. That is why you are still here.`,
    ref: 'Matthew 17:20 / 1 Enoch 48',
  },
  {
    id: 'notk-3',
    title: 'The Archeology of the Soul',
    content: `Sin causes us to hide under layers of shame — what the Aramaic calls tapha — making us invisible to ourselves. The enemy builds a hard husk of distraction, despair, and religion around the life inside you. He wants you to identify as the husk rather than the Life.

Jesus does not come to help you become a better version of yourself. He comes to dig. He goes into the depths of the earth — your buried life — to find the Seed He planted. He is not looking for improvement. He is looking for Himself in you.

This is why He is not intimidated by your darkness. He designed the excavation before you were born.`,
    ref: 'Ephesians 4:9 / Aramaic: tapha',
  },
  {
    id: 'notk-4',
    title: 'The Scribe of Broken Stones',
    content: `The original tablets of the Law were shattered. God commanded the broken pieces be placed inside the Ark.

God's power does not sit on perfection. It sits on shattered pieces.

Brokenness is not a failure. It is how the light gets out. A feral Misfit communicates the King's fire more effectively than a polished speaker because the cracks prove the comm line is open for everyone. You are not broken in spite of what you carry. You are qualified because of it.

The Iron Scribe writes on the tablet of the heart — not on the clean surface, but on the cracked one. That is where the words stay.`,
    ref: 'Exodus 34:1 / Deuteronomy 10:2',
  },
  {
    id: 'notk-5',
    title: 'The Nature of the Misfit',
    content: `When a child is traumatized, the soul grows old quickly to cope with things the young body cannot handle. This creates an outsiderism — because peers cannot understand the internal age of the trauma. Misfits often have young hearts but hyper-mature minds. They become little ninjas. Problem solvers who hide in shadows to survive.

Trauma often kills a child's belief in God. The devil attacks early. He wants the soul hyper-mature mentally while remaining stunted emotionally and spiritually — unreachable by the very thing that could save it.

But when a Misfit finally finds God, they hold on until their fingers bleed. Because they recognize the Truth they have been searching for their whole lives. And they do not let go of things they had to fight to find.`,
    ref: 'Isaiah 53:3 / 1 Enoch 103',
  },
  {
    id: 'notk-6',
    title: 'Khuba: Love That Does Not Leave',
    content: `Blood makes you related. Love and loyalty make you family.

The world says "you deserve better" as an excuse to abandon. Khuba says there is no exit when the covenant is real. True covenant love is a constant refill from the Source — God — so the pouring out never stops. You cannot run dry if you stay connected to the spring.

The Covenant of the Trench is this: True love is a mutual laying down of life. Not a transaction. Not a feeling. A death — chosen, daily, on purpose — for the person standing next to you in the dark.

This is what He did. This is what He requires. This is what we carry.`,
    ref: 'John 15:13 / Aramaic: Khuba',
  },
  {
    id: 'notk-7',
    title: 'The Warrior in the Rehab',
    content: `People in rehab — especially repeat offenders — are not weak. They are warriors who have been fighting for a god that is killing them. They gave everything to the wrong altar. They know how to bleed for something. They just need to find out what is worth bleeding for.

Jesus calls to those who are broken and heavy laden. He invites them to drop the heavy iron of shame and take His yoke — which is life without a burden.

He is not intimidated by drug use or brokenness. He loves the addict exactly as they are. His presence — not human effort — is what burns the monster off their back.

You do not have to be clean to come. You just have to come.`,
    ref: 'Matthew 11:28 / Luke 4:18',
  },
  {
    id: 'notk-8',
    title: 'The Harrowing of the Flesh',
    content: `The Western church skips from Friday to Sunday. The ancient Ethiopian texts and the Aramaic reality know that Saturday was the greatest battle in the history of the cosmos.

When Jesus died, He did not rest. He invaded.

He descended into Sheol — not a Greek Hades where souls float aimlessly — but a prison camp. He did not knock on the gates of brass. He kicked them off their hinges. He bound the rulers of the darkness in their own domain. He went into the absolute lowest, most crushed, and corrupted place in the universe to pull the captives out by force.

This is your image: the scarred hand reaching down to grab the burned hand. He broke the system from the inside.

If you feel like you are in a dark place — addiction, depression, failure, shame — you are in the exact territory Jesus specializes in invading.`,
    ref: '1 Peter 3:19 / Book of Mercy (Metsihafe Mihret)',
  },
];

interface Note {
  id: string;
  title: string;
  content: string;
  ref: string;
}

export default function NotesFromTheKing() {
  const forgeActive = false;
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('misfit-notes-from-king');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch { return DEFAULT_NOTES; }
  });

  const [addingNote, setAddingNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRef, setNewRef] = useState('');

  function saveNewNote() {
    if (!newTitle.trim() || !newContent.trim()) return;
    const note: Note = {
      id: `notk-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      ref: newRef.trim(),
    };
    const updated = [...notes, note];
    setNotes(updated);
    localStorage.setItem('misfit-notes-from-king', JSON.stringify(updated));
    setNewTitle('');
    setNewContent('');
    setNewRef('');
    setAddingNote(false);
    setOpenNote(note.id);
  }

  function deleteNote(id: string) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('misfit-notes-from-king', JSON.stringify(updated));
    if (openNote === id) setOpenNote(null);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0a0a0a',
    border: '1px solid #1a1a1a',
    color: '#e8e4dc',
    padding: '12px 16px',
    fontFamily: 'EB Garamond, Georgia, serif',
    fontSize: '1rem',
    outline: 'none',
    marginBottom: 12,
    display: 'block',
  };

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#e8e4dc',
      fontFamily: "'EB Garamond', 'Georgia', serif",
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 120px' }}>

        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 16 }}>
          Notes from the King
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 24 }}>
          Downloads from the Throne Room.
        </h1>

        <p style={{ fontSize: '1.2rem', lineHeight: 1.9, color: '#888', marginBottom: 60 }}>
          These are not sermons. These are not devotionals. These are the things He said — captured as fast as they could be written down, before they could be lost. Some of them came at 3am. Some of them came in the middle of pain that should have produced nothing but silence. They are the bedrock of this ministry. Read them the way you'd read a letter that was written in blood.
        </p>

        <div style={{ width: 60, height: 2, background: '#8B0000', marginBottom: 80 }} />

        {notes.map((note, i) => (
          <div
            key={note.id}
            style={{
              marginBottom: 48,
              borderLeft: openNote === note.id ? '3px solid #8B0000' : '3px solid #1a1a1a',
              paddingLeft: 32,
              transition: 'border-color 0.3s',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, cursor: 'pointer' }}
              onClick={() => setOpenNote(openNote === note.id ? null : note.id)}
            >
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 8 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 700, color: openNote === note.id ? '#fff' : '#ccc', lineHeight: 1.3, transition: 'color 0.2s' }}>
                  {note.title}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24, flexShrink: 0 }}>
                {forgeActive && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    style={{ background: 'none', border: '1px solid #333', color: '#cc2200', cursor: 'pointer', padding: '4px 8px', fontSize: '0.6rem', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Remove
                  </button>
                )}
                <div style={{ color: '#333', fontSize: '1.2rem', transition: 'transform 0.2s', transform: openNote === note.id ? 'rotate(45deg)' : 'none' }}>+</div>
              </div>
            </div>

            {openNote === note.id && (
              <div style={{ marginTop: 24 }}>
                {note.content.split('\n\n').map((para, j) => (
                  <p key={j} style={{ fontSize: '1.2rem', lineHeight: 2, color: '#ccc', marginBottom: 24 }}>{para}</p>
                ))}
                {note.ref && (
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#444', marginTop: 16, paddingTop: 16, borderTop: '1px solid #1a1a1a' }}>
                    {note.ref}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {forgeActive && (
          <div style={{ marginTop: 40 }}>
            {!addingNote ? (
              <button
                onClick={() => setAddingNote(true)}
                style={{
                  width: '100%', padding: '16px', background: 'none',
                  border: '1px dashed #8B0000', color: '#8B0000',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem',
                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                + Add New Note from the King
              </button>
            ) : (
              <div style={{ border: '1px solid #1a1a1a', padding: 32, background: '#0d0d0d' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B0000', marginBottom: 20 }}>
                  New Note from the King
                </div>
                <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inputStyle} />
                <textarea
                  placeholder="The download... (separate paragraphs with a blank line)"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={8}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <input placeholder="Scripture reference (optional)" value={newRef} onChange={e => setNewRef(e.target.value)} style={{ ...inputStyle, fontSize: '0.85rem' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={saveNewNote} style={{ background: '#8B0000', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Save Note
                  </button>
                  <button onClick={() => setAddingNote(false)} style={{ background: 'none', color: '#555', border: '1px solid #222', padding: '12px 24px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 80, padding: '48px 0', borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3rem', color: '#555', fontStyle: 'italic', lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
            "Their pain does not disqualify them. It is the very means by which they are qualified."
          </p>
          <div style={{ marginTop: 8, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333' }}>
            — The Iron Scribe
          </div>
        </div>
      </div>
    </div>
  );
}
