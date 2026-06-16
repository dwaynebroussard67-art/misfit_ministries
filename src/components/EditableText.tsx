import { useState } from 'react';
import { useCMS } from '../lib/CMSContext';
import { useAuth } from '../lib/AuthContext';

export function EditableText({ id, fallback, as = 'span', style }: {
  id: string;
  fallback: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
  style?: React.CSSProperties;
}) {
  const { get, save } = useCMS();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const value = get(id, fallback);

  const handleBlur = async (e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.textContent || '';
    if (newText !== value) {
      setSaving(true);
      await save(id, newText);
      setSaving(false);
    }
  };

  const Tag = as as any;

  // Owner + logged in = editable. Everyone else = plain read-only text.
  if (user) {
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        style={{ ...style, outline: saving ? '2px solid #c9a030' : '1px dashed rgba(201,160,48,0.4)', borderRadius: '2px' }}
      >
        {value}
      </Tag>
    );
  }

  return <Tag style={style}>{value}</Tag>;
}
