import { CSSProperties } from 'react';
import { useForge } from '../lib/ForgeContext';

interface ForgeImageProps {
  slotId: string;
  fallbackSrc?: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}

export default function ForgeImage({
  slotId,
  fallbackSrc,
  alt = '',
  style,
  className,
}: ForgeImageProps) {
  const { getImageForSlot } = useForge();
  const slotImg = getImageForSlot(slotId);
  const src = slotImg ? slotImg.url : fallbackSrc;

  if (!src) {
    return (
      <div style={{ ...style, background: '#1a1a1a', minHeight: 200 }} className={className} />
    );
  }

  return <img src={src} alt={alt} style={style} className={className} />;
}
