import { Shield, Heart, Users } from 'lucide-react';

export default function Constitution() {
  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gold mb-8 font-serif text-center">
            Community Constitution
          </h1>
          <p className="text-xl text-text-secondary text-center">
            The values and guidelines that hold our community together.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-gold" size={32} />
              <h2 className="text-3xl font-bold text-gold font-serif">We Are a Safe Place</h2>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              This community is a safe place for people in crisis. No judgment. No shame. No condemnation. If you're struggling, you belong here.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-gold" size={32} />
              <h2 className="text-3xl font-bold text-gold font-serif">We Respect Each Other</h2>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              We treat each other with dignity and respect. We listen without judgment. We support without condition. We believe in the inherent worth of every person.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-gold" size={32} />
              <h2 className="text-3xl font-bold text-gold font-serif">We Keep Confidence</h2>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              What's shared here stays here. We protect privacy. We honor confidentiality. We don't share your story without permission.
            </p>
          </div>

          <div className="bg-dark-secondary rounded-lg p-8 border border-gold/20">
            <h3 className="text-2xl font-bold text-gold mb-4 font-serif">Community Guidelines</h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="text-gold font-bold">1.</span>
                <span>Be honest. Share your real struggles, not a polished version.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">2.</span>
                <span>Be kind. Lift others up. Don't tear them down.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">3.</span>
                <span>Be respectful. Honor different perspectives and experiences.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">4.</span>
                <span>Be safe. Don't share content that glorifies harm or violence.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">5.</span>
                <span>Be real. No perfect facades. We're all broken here.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gold/10 rounded-lg p-8 border border-gold/30">
            <h3 className="text-2xl font-bold text-gold mb-4 font-serif">In Crisis?</h3>
            <p className="text-text-secondary mb-4">
              If you're in immediate danger or having thoughts of suicide, please reach out to a crisis resource right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:988" className="bg-gold text-dark px-6 py-2 rounded font-bold hover:bg-gold/90 transition-colors">
                Call 988
              </a>
              <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="bg-dark-secondary text-gold px-6 py-2 rounded font-bold border border-gold/30 hover:border-gold transition-colors">
                Text Crisis Line
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
