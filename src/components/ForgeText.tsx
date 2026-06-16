import { CSSProperties } from 'react';
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
  const { getText } = useForge();
  const text = getText(id, defaultText);

  return (
    // @ts-ignore
    <Tag className={className} style={style}>
      {text}
    </Tag>
  );
}
