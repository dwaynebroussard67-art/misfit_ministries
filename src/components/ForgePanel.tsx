import { useRef, useState } from 'react';
import { useForge } from '../lib/ForgeContext';

const ALL_SLOTS = [
  { id: 'hero-landing', label: 'Landing Hero' },
  { id: 'section-jesus', label: 'Jesus Holds Man' },
  { id: 'section-fire', label: 'Man in Fire' },
  { id: 'hero-home', label: 'Home Hero' },
  { id: 'section-jesus-lifts', label: 'Jesus Lifts Man' },
  { id: 'section-chains', label: 'Chains Breaking' },
  { id: 'khuba-cross', label: 'Khuba Cross' },
  { id: 'about-hero', label: 'About Image' },
  { id: 'armory-img-1', label: 'Armory Product 1' },
  { id: 'armory-img-2', label: 'Armory Product 2' },
  { id: 'armory-img-3', label: 'Armory Product 3' },
  { id: 'armory-img-4', label: 'Armory Product 4' },
];

export default function ForgePanel() {
  const { forgeActive, toggleForge, gallery, addImages, removeImage, assignImage, placements, draggedImage, setDraggedImage } = useForge();
  const [tab, setTab] = useState<'gallery' | 'slots' | 'place'>('gallery');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<string>('cover');
  const [selectedOpacity, setSelectedOpacity] = useState<number>(1);
  const fileInput = useRef<HTMLInputElement>(null);

  if (!forgeActive) {
    return (
      <button className="forge-badge" onClick={toggleForge}>
        ⚒ Forge Mode
      </button>
    );
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: '#8B0000', zIndex: 999 }} />

      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 340,
        background: '#080808', borderLeft: '1px solid #1a1a1a',
        zIndex: 500, display: 'flex', flexDirection: 'column',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B0000' }}>⚒ Forge — God Mode</div>
            <div style={{ fontSize: '0.6rem', color: '#333', marginTop: 2 }}>Click text or image to edit · Drag images to slots</div>
          </div>
          <button onClick={toggleForge} style={{ background: 'none', border: '1px solid #222', color: '#666', padding: '6px 12px', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Exit</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #111' }}>
          {(['gallery', 'slots', 'place'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px 4px', background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #8B0000' : '2px solid transparent',
              color: tab === t ? '#fff' : '#333',
              cursor: 'pointer', fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {t === 'place' ? 'Place' : t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>

          {tab === 'gallery' && (
            <>
              <input ref={fileInput} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => e.target.files && addImages(e.target.files)} />
              <button onClick={() => fileInput.current?.click()} style={{ width: '100%', padding: '12px', background: '#8B0000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                + Upload Images
              </button>
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) addImages(e.dataTransfer.files); }}
                style={{ border: '1px dashed #222', padding: 16, textAlign: 'center', marginBottom: 16, color: '#333', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Or drag & drop files here
              </div>

              {gallery.length === 0 ? (
                <p style={{ color: '#222', fontSize: '0.7rem', textAlign: 'center', marginTop: 24 }}>No images yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {gallery.map(img => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => setDraggedImage(img.id)}
                      onDragEnd={() => setDraggedImage(null)}
                      onClick={() => setSelectedImage(selectedImage === img.id ? null : img.id)}
                      style={{
                        position: 'relative', cursor: 'grab',
                        border: selectedImage === img.id ? '2px solid #cc2200' : draggedImage === img.id ? '2px solid #8B0000' : '1px solid #1a1a1a',
                      }}
                    >
                      <img src={img.url} alt={img.name} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
                      {Object.values(placements).some(p => p.imageId === img.id) && (
                        <div style={{ position: 'absolute', top: 2, left: 2, background: '#8B0000', color: '#fff', fontSize: '0.5rem', fontWeight: 700, padding: '1px 4px' }}>IN USE</div>
                      )}
                      <button onClick={e => { e.stopPropagation(); removeImage(img.id); }} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.8)', border: 'none', color: '#cc2200', cursor: 'pointer', width: 18, height: 18, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      <div style={{ padding: '3px 4px', fontSize: '0.55rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'slots' && (
            <div>
              <p style={{ fontSize: '0.7rem', color: '#444', marginBottom: 16, lineHeight: 1.6 }}>
                All image slots on the site. Click a slot to assign from gallery, or drag an image from Gallery tab onto any slot below.
              </p>
              {ALL_SLOTS.map(slot => {
                const placed = placements[slot.id];
                const img = placed ? gallery.find(i => i.id === placed.imageId) : null;
                return (
                  <div
                    key={slot.id}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); if (draggedImage) assignImage(draggedImage, slot.id, selectedPlacement, selectedOpacity); }}
                    style={{ padding: '10px 0', borderBottom: '1px solid #0d0d0d', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                    onClick={() => { if (selectedImage) assignImage(selectedImage, slot.id, selectedPlacement, selectedOpacity); }}
                  >
                    {img ? (
                      <img src={img.url} style={{ width: 40, height: 28, objectFit: 'cover', flexShrink: 0 }} alt="" />
                    ) : (
                      <div style={{ width: 40, height: 28, background: '#0d0d0d', border: '1px dashed #1a1a1a', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', color: img ? '#fff' : '#444' }}>{slot.label}</div>
                      <div style={{ fontSize: '0.55rem', color: '#333', marginTop: 1 }}>{slot.id}</div>
                    </div>
                    <div style={{ fontSize: '0.55rem', color: img ? '#8B0000' : '#1a1a1a' }}>
                      {img ? '● Set' : '○ Empty'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'place' && (
            <div>
              <p style={{ fontSize: '0.7rem', color: '#444', marginBottom: 20, lineHeight: 1.6 }}>
                Choose how images are placed when assigned to a slot.
              </p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.6rem', color: '#555', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Placement Type</div>
                {['cover', 'background', 'inline', 'hero'].map(p => (
                  <button key={p} onClick={() => setSelectedPlacement(p)} style={{
                    display: 'block', width: '100%', padding: '10px 12px', marginBottom: 6,
                    background: selectedPlacement === p ? '#8B0000' : '#0d0d0d',
                    border: '1px solid',
                    borderColor: selectedPlacement === p ? '#8B0000' : '#1a1a1a',
                    color: selectedPlacement === p ? '#fff' : '#555',
                    cursor: 'pointer', textAlign: 'left',
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {p}
                    <span style={{ fontWeight: 400, color: '#444', marginLeft: 8 }}>
                      {p === 'cover' && '— fills container, cropped'}
                      {p === 'background' && '— behind content'}
                      {p === 'inline' && '— flows with text'}
                      {p === 'hero' && '— full bleed, fixed'}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.6rem', color: '#555', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Opacity: {Math.round(selectedOpacity * 100)}%
                </div>
                <input
                  type="range" min="0.1" max="1" step="0.05"
                  value={selectedOpacity}
                  onChange={e => setSelectedOpacity(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#8B0000' }}
                />
              </div>

              <div style={{ padding: 12, background: '#0d0d0d', border: '1px solid #111', fontSize: '0.65rem', color: '#444', lineHeight: 1.7 }}>
                Select an image in Gallery, then click a slot in Slots to apply with these settings. Or drag images directly onto slots.
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #0d0d0d', display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#222' }}>
          <span>{gallery.length} image{gallery.length !== 1 ? 's' : ''} in gallery</span>
          <span>{Object.keys(placements).length} slot{Object.keys(placements).length !== 1 ? 's' : ''} assigned</span>
        </div>
      </div>
    </>
  );
}
