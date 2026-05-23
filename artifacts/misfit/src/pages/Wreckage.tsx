import { AlertCircle, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wreckage() {
  const resources = [
    { name: '988 Suicide & Crisis Lifeline', phone: '988', url: 'https://988lifeline.org', desc: 'Call or text 988' },
    { name: 'Crisis Text Line', phone: 'Text HOME to 741741', url: 'https://www.crisistextline.org', desc: 'Free, 24/7' },
    { name: 'SAMHSA National Helpline', phone: '1-800-662-4357', url: 'https://www.samhsa.gov', desc: 'Substance abuse & mental health' },
    { name: 'National Domestic Violence Hotline', phone: '1-800-799-7233', url: 'https://www.thehotline.org', desc: 'Confidential support' },
    { name: 'NAMI Helpline', phone: '1-800-950-6264', url: 'https://www.nami.org', desc: 'Mental illness support' },
    { name: 'Trevor Project', phone: '1-866-488-7386', url: 'https://www.thetrevorproject.org', desc: 'LGBTQ+ crisis support' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <AlertCircle className="text-gold" size={40} />
            <h1 className="text-5xl font-bold text-gold font-serif">The Wreckage</h1>
          </div>
          <p className="text-xl text-text-secondary text-center">Crisis resources. Help is available right now.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gold/10 rounded-lg p-8 border border-gold/30 mb-12">
            <p className="text-lg text-text-secondary">
              If you're in immediate danger or having thoughts of suicide, please reach out to a crisis resource right now. You are not alone. Help is available.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {resources.map((resource, i) => (
              <div key={i} className="bg-dark-secondary rounded-lg p-6 border border-gold/20 hover:border-gold transition-colors">
                <h3 className="text-xl font-bold text-gold mb-2">{resource.name}</h3>
                <div className="flex flex-col sm:flex-row gap-4 text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-gold" />
                    <a href={`tel:${resource.phone}`} className="hover:text-gold transition-colors">{resource.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-gold" />
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Visit Website</a>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-2">{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
