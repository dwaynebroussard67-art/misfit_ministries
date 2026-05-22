import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Home() {
  const { data: siteCopy } = useQuery({
    queryKey: ['siteCopy'],
    queryFn: async () => {
      const res = await axios.get('/api/site-copy');
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-dark">
      <header className="bg-surface border-b border-dark py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-gold text-4xl font-bold">
            {siteCopy?.['home.hero.eyebrow'] || 'WELCOME TO MISFIT MINISTRIES'}
          </h1>
          <p className="text-gold text-2xl mt-2">
            {siteCopy?.['home.hero.heading'] || 'A Beacon for Humanity'}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gold mb-4">
            {siteCopy?.['home.community.heading'] || 'A Hospital for the Broken'}
          </h2>
          <p className="text-lg text-text-secondary">
            {siteCopy?.['home.community.description'] || 'We are a community for people who have been written off.'}
          </p>
        </section>

        <section className="mb-12">
          <div className="bg-red text-dark p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Crisis Support</h3>
            <p className="text-lg font-bold mb-4">Call 988 (Suicide & Crisis Lifeline)</p>
            <p>Available 24/7 for anyone in crisis or emotional distress.</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gold mb-6">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/prayer" className="bg-surface p-6 rounded-lg hover:bg-dark-border transition">
              <h3 className="text-xl font-bold text-gold mb-2">Prayer Wall</h3>
              <p>Submit prayer requests and pray with our community.</p>
            </a>
            <a href="/shine" className="bg-surface p-6 rounded-lg hover:bg-dark-border transition">
              <h3 className="text-xl font-bold text-gold mb-2">Testimonies</h3>
              <p>Share your story of redemption and transformation.</p>
            </a>
            <a href="/nura" className="bg-surface p-6 rounded-lg hover:bg-dark-border transition">
              <h3 className="text-xl font-bold text-gold mb-2">Talk to Nura</h3>
              <p>A motherly AI companion grounded in Ethiopian Orthodox theology.</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
