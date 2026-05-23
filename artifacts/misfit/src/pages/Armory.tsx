import { BookOpen, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Armory() {
  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gold mb-8 font-serif">The Armory</h1>
          <p className="text-xl text-text-secondary">Training, tools, and resources for people who want to help.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-text-secondary mb-12 text-center">
            Want to help people in crisis? Here are tools, training, and resources to equip you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-secondary rounded-lg p-6 border border-gold/20">
              <BookOpen className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Crisis Response Training</h3>
              <p className="text-text-secondary">Learn how to respond when someone is in crisis.</p>
            </div>
            <div className="bg-dark-secondary rounded-lg p-6 border border-gold/20">
              <Users className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Community Support</h3>
              <p className="text-text-secondary">Join our network of people helping others.</p>
            </div>
            <div className="bg-dark-secondary rounded-lg p-6 border border-gold/20">
              <Heart className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Prayer Resources</h3>
              <p className="text-text-secondary">Tools and guides for intercession.</p>
            </div>
            <div className="bg-dark-secondary rounded-lg p-6 border border-gold/20">
              <BookOpen className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Scripture Study</h3>
              <p className="text-text-secondary">Biblical foundation for ministry.</p>
            </div>
          </div>

          <div className="mt-12 bg-gold/10 rounded-lg p-8 border border-gold/30 text-center">
            <h3 className="text-2xl font-bold text-gold mb-4 font-serif">Want to Get Involved?</h3>
            <p className="text-text-secondary mb-6">
              Join our community of helpers. Together, we can serve people in crisis.
            </p>
            <Link to="/prayer" className="inline-block bg-gold text-dark px-8 py-3 rounded font-bold hover:bg-gold/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
