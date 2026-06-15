import { useState, useRef, CSSProperties } from 'react';
import { useForge } from '../lib/ForgeContext';

interface ForgeTextProps {
  id: string;
  defaultText: string;
  tagName?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  className?: string;
}

export default function ForgeText({
  id,
  defaultText,
  tagName: Tag = 'p',
  style,
  className,
}: ForgeTextProps) {
  const { forgeActive, editingId, setEditingId, saveText, getText } = useForge();
  const [draft, setDraft] = useState('');
  const ref = useRef<HTMLElement>(null);
  const isEditing = editingId === id;
  const text = getText(id, defaultText);

  function startEdit() {
    if (!forgeActive) return;
    setDraft(text);
    setEditingId(id);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setEditingId(null); }
    if (e.key === 'Enter' && e.metaKey) { saveText(id, draft); }
  }

  if (isEditing) {
    return (
      <div style={{ position: 'relative' }}>
        <textarea
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          style={{
            width: '100%',
            minHeight: '120px',
            background: '#111',
            color: '#e8e4dc',
            border: '2px solid #cc2200',
            padding: '12px',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => saveText(id, draft)}
            style={{
              background: '#8B0000', color: '#fff', border: 'none',
              padding: '8px 20px', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >Save</button>
          <button
            onClick={() => setEditingId(null)}
            style={{
              background: 'transparent', color: '#9a9690', border: '1px solid #444',
              padding: '8px 20px', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >Cancel</button>
          <span style={{
            fontSize: '0.7rem', color: '#444', alignSelf: 'center',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>Cmd+Enter to save · Esc to cancel</span>
        </div>
      </div>
    );
  }

  return (
    // @ts-ignore
    <Tag
// @ts-ignore
// @ts-ignore
      ref={ref}
      data-forge-id={id}
      className={`${className ?? ''} ${forgeActive ? 'forge-editable' : ''}`}
      style={style}
      onClick={startEdit}
      title={forgeActive ? 'Click to edit' : undefined}
    >
      {text}
    </Tag>
  );
}
