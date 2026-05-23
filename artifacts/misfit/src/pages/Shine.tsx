import { Star, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Shine() {
  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gold mb-8 font-serif">Shine</h1>
          <p className="text-xl text-text-secondary">Success stories. Transformation. Real redemption.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-text-secondary mb-12 text-center">
            These are real people who've been where you are. Who found hope. Who found Jesus. Who are now helping others do the same.
          </p>
          <Link to="/testimonies" className="block bg-dark-secondary rounded-lg p-8 border border-gold/20 hover:border-gold transition-colors text-center">
            <Star className="text-gold mx-auto mb-4" size={40} />
            <h2 className="text-3xl font-bold text-gold mb-4 font-serif">Read Full Stories</h2>
            <p className="text-text-secondary">See how God is working in the lives of misfits like us.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
