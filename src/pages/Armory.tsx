import ForgeText from '../components/ForgeText';
import ForgeImage from '../components/ForgeImage';

const products = [
  { id: 'armory-p1', name: 'Misfit Dog Tag', price: '$24', desc: 'Stainless steel. Wears like a reminder.', slot: 'armory-img-1' },
  { id: 'armory-p2', name: 'Lion of Judah Tee', price: '$35', desc: 'Black. Heavy cotton. No apology.', slot: 'armory-img-2' },
  { id: 'armory-p3', name: 'Khuba Cross Print', price: '$45', desc: 'Gold on black. Frameable. Sacred.', slot: 'armory-img-3' },
  { id: 'armory-p4', name: 'War Room Hoodie', price: '$65', desc: 'For the long nights. You know the ones.', slot: 'armory-img-4' },
];

export default function Armory() {
  return (
    <div style={{ background: '#0a0a0a', color: '#e8e4dc', fontFamily: "'EB Garamond', 'Georgia', serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{ marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B0000' }}>
          The Armory
        </div>

        <ForgeText
          id="armory-title"
          tagName="h1"
          defaultText="Gear for the Fight."
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.2, color: '#fff', marginBottom: 16 }}
        />

        <ForgeText
          id="armory-sub"
          defaultText="Every purchase goes directly to the mission. Nothing here is for decoration. Everything here means something."
          style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#777', maxWidth: 600, display: 'block', marginBottom: 80 }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
          {products.map(product => (
            <div key={product.id} style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
              <ForgeImage
                slotId={product.slot}
                alt={product.name}
                style={{ width: '100%', height: 280, objectFit: 'cover', filter: 'brightness(0.85)' } as React.CSSProperties}
              />
              <div style={{ padding: 24 }}>
                <ForgeText
                  id={`${product.id}-name`}
                  tagName="h3"
                  defaultText={product.name}
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}
                />
                <ForgeText
                  id={`${product.id}-desc`}
                  defaultText={product.desc}
                  style={{ fontSize: '1rem', lineHeight: 1.6, color: '#666', marginBottom: 16, display: 'block' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', color: '#fff', fontWeight: 700 }}>{product.price}</span>
                  <button className="btn-ghost" style={{ padding: '8px 20px', fontSize: '0.7rem', cursor: 'pointer' }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 80, textAlign: 'center', padding: '48px 32px', borderTop: '1px solid #1a1a1a' }}>
          <ForgeText
            id="armory-footer"
            defaultText="100% of proceeds fund the mission. No overhead. No salaries. No empire."
            style={{ fontSize: '1.1rem', color: '#555', fontStyle: 'italic' }}
          />
        </div>
      </div>
    </div>
  );
}
