import { BookOpen, Lock } from 'lucide-react';

export default function Teachings() {
  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gold mb-8 font-serif">Teachings</h1>
          <p className="text-xl text-text-secondary">Sermons, teachings, and spiritual formation.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-secondary rounded-lg p-12 border border-gold/20 text-center">
            <BookOpen className="text-gold mx-auto mb-6" size={64} />
            <h2 className="text-3xl font-bold text-gold mb-4 font-serif">Teachings Coming Soon</h2>
            <p className="text-lg text-text-secondary mb-6">
              Sermons and teachings grounded in Scripture and Ethiopian Orthodox theology.
            </p>
            <p className="text-text-secondary">
              Check back soon for content about the seven archangels, spiritual formation, and more.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
