import { useState, CSSProperties } from 'react';
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
  const { forgeActive, gallery, assignImage, getImageForSlot } = useForge();
  const [pickerOpen, setPickerOpen] = useState(false);
  const slotImg = getImageForSlot(slotId);
  const src = slotImg ? slotImg.url : fallbackSrc;

  function handleClick() {
    if (!forgeActive) return;
    setPickerOpen(true);
  }

  function pick(imageId: string) {
    assignImage(imageId, slotId);
    setPickerOpen(false);
  }

  return (
    <>
      <div
        data-forge-slot={slotId}
        onClick={handleClick}
        style={{ position: 'relative', cursor: forgeActive ? 'pointer' : 'default' }}
      >
        {src ? (
          <img src={src} alt={alt} style={style} className={className} />
        ) : (
          <div style={{
            ...style,
            background: '#1a1a1a',
            border: forgeActive ? '2px dashed #8B0000' : '2px dashed #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8,
            minHeight: 200,
          }}>
            <span style={{ fontSize: '2rem', opacity: 0.3 }}>⬛</span>
            {forgeActive && (
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#8B0000',
              }}>Click to assign image</span>
            )}
          </div>
        )}
        {forgeActive && src && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(139,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
          >
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#fff', background: '#8B0000',
              padding: '8px 16px',
            }}>Change Image</span>
          </div>
        )}
      </div>

      {pickerOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setPickerOpen(false)}>
          <div style={{
            background: '#111', border: '1px solid #333',
            padding: 32, maxWidth: 800, width: '90vw', maxHeight: '80vh',
            overflow: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a9690',
              }}>Select Image for Slot: {slotId}</span>
              <button onClick={() => setPickerOpen(false)} style={{
                background: 'none', border: 'none', color: '#9a9690',
                fontSize: '1.5rem', cursor: 'pointer',
              }}>×</button>
            </div>
            {gallery.length === 0 ? (
              <p style={{ color: '#444', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem' }}>
                No images in gallery yet. Upload images using the Forge panel.
              </p>
            ) : (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12,
              }}>
                {gallery.map(img => (
                  <div key={img.id} onClick={() => pick(img.id)} style={{
                    cursor: 'pointer', border: '1px solid #333',
                    overflow: 'hidden', transition: 'border 0.15s',
                  }}>
                    <img src={img.url} alt={img.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                    <div style={{ padding: '6px 8px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.65rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
