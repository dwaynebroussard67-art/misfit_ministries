import { Link } from 'react-router-dom';
import ForgeText from '../components/ForgeText';
import ForgeImage from '../components/ForgeImage';

export default function Landing() {
  return (
    <div style={{ background: '#0a0a0a', color: '#e8e4dc', fontFamily: "'EB Garamond', 'Georgia', serif", minHeight: '100vh', overflowX: 'hidden' }}>

      <div style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 600, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ForgeImage
          slotId="hero-landing"
          fallbackSrc="/images/Blindfolded_man.jpg"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.45)' } as React.CSSProperties}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 700 }}>
          <ForgeText
            id="landing-title"
            tagName="h1"
            defaultText="You found it. Stop running. Breathe."
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2, color: '#fff', textShadow: '0 2px 30px rgba(0,0,0,0.9)', margin: 0 }}
          />
          <div style={{ marginTop: 24, width: 60, height: 3, background: '#8B0000', margin: '24px auto 0' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px 0' }}>
        <ForgeText
          id="landing-p1"
          defaultText="You don't have to explain yourself here. Not what you did. Not what was done to you. Not the years, not the nights, not the names you called yourself when nobody was listening. He already knows all of it. He was there. Every single time. Standing right next to you in the dark — not to record it, not to use it against you — but because He refused to let you be alone in it. And when it was all said and done, He looked at all of it. And He chose you anyway."
          style={{ fontSize: '1.25rem', lineHeight: 2, color: '#ddd' }}
        />
      </div>

      <div style={{ position: 'relative', width: '100%', height: '70vh', minHeight: 420, margin: '80px 0', overflow: 'hidden' }}>
        <ForgeImage
          slotId="section-jesus"
          fallbackSrc="/images/Jesus_holds_man.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.55) sepia(0.15)' } as React.CSSProperties}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, transparent 50%, rgba(0,0,0,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 clamp(24px, 8vw, 120px)' }}>
          <div style={{ maxWidth: 500 }}>
            <ForgeText
              id="landing-p2"
              defaultText="That's not the Jesus they sold you. That's the real one. The Lion of Judah. Iyesus Kristos. The Ancient of Days who was brown and beaten and buried and still came back."
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', lineHeight: 1.7, color: '#fff', fontStyle: 'italic', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px' }}>
        <ForgeText
          id="landing-p3"
          defaultText="Your scars aren't failures. They're evidence. Evidence that everything the enemy threw at you — every weapon, every night, every cell, every needle — couldn't finish you. You're still here. So are we."
          style={{ fontSize: '1.25rem', lineHeight: 2, color: '#ddd' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '80px 0', position: 'relative' }}>
        <div style={{ width: 'clamp(280px, 50vw, 600px)', height: 'clamp(350px, 60vh, 700px)', overflow: 'hidden', position: 'relative' }}>
          <ForgeImage
            slotId="section-fire"
            fallbackSrc="/images/man_in_fire.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.7)' } as React.CSSProperties}
          />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', background: 'linear-gradient(to right, #0a0a0a, transparent)' }} />
        </div>
        <div style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', maxWidth: 'clamp(200px, 42vw, 500px)', zIndex: 2 }}>
          <ForgeText
            id="landing-warning-title"
            tagName="h2"
            defaultText="⚠ A Warning Before You Enter"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: '#cc2200', marginBottom: 20, fontWeight: 700, letterSpacing: '0.03em' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px', borderLeft: '3px solid #8B0000' }}>
        <ForgeText id="landing-warning-p1" defaultText="This is not a casual place. You are welcome to look around. Buy something if you want to support the work. Tell somebody about us. Listen to what we teach about Jesus. All of that is yours, no questions asked." style={{ fontSize: '1.2rem', lineHeight: 2, color: '#ccc', display: 'block' }} />
        <ForgeText id="landing-warning-p2" defaultText="But if you're thinking about calling yourself a Misfit — stop. And understand what that means before you say it. This ground is hallowed. It was paid for in blood — His first, and then the blood of every broken soldier who crawled their way here and decided to fight for the person coming in behind them." style={{ fontSize: '1.2rem', lineHeight: 2, color: '#ccc', display: 'block', marginTop: 24 }} />
        <ForgeText id="landing-warning-p3" defaultText="We don't want your religion. We don't want your agenda. We want one thing. Did you walk in darkness? Do you know what it costs to survive a night that was trying to kill you? Are you done walking it alone? If that's you — walk through." style={{ fontSize: '1.2rem', lineHeight: 2, color: '#ccc', display: 'block', marginTop: 24 }} />
        <ForgeText id="landing-warning-p4" defaultText="Because the moment you do, you don't walk alone again. Not ever. We stand. We don't flinch. We don't turn our backs. If you die, we die with you. But we don't plan on dying. We plan on winning. Because the one who called us here already defeated everything that's coming for you — and He did it with His hands nailed down." style={{ fontSize: '1.2rem', lineHeight: 2, color: '#ccc', display: 'block', marginTop: 24 }} />
      </div>

      <div style={{ textAlign: 'center', padding: '100px 32px 120px' }}>
        <Link to="/home" className="btn-primary">Welcome Home, Misfit</Link>
      </div>
    </div>
  );
}
