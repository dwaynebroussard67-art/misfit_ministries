import { Users, Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gold mb-8 font-serif text-center">
            About Misfit Ministries
          </h1>
          <p className="text-xl text-text-secondary text-center mb-12">
            Our story. Our mission. Our commitment to people in crisis.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gold mb-6 font-serif">Who We Are</h2>
          <p className="text-lg text-text-secondary mb-6 leading-relaxed">
            Misfit Ministries is a community of people who don't fit anywhere else. We're broken. We're searching. We're real. And we believe that's exactly who God is looking for.
          </p>
          <p className="text-lg text-text-secondary mb-6 leading-relaxed">
            We exist to serve people in crisis. To provide resources. To offer prayer. To connect you with a community that gets it. That doesn't judge. That shows up when life falls apart.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gold mb-8 font-serif">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark rounded-lg p-6 border border-gold/20">
              <Heart className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Serve</h3>
              <p className="text-text-secondary">
                We serve people in crisis with compassion, resources, and prayer.
              </p>
            </div>
            <div className="bg-dark rounded-lg p-6 border border-gold/20">
              <Users className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Connect</h3>
              <p className="text-text-secondary">
                We connect people with community, support, and each other.
              </p>
            </div>
            <div className="bg-dark rounded-lg p-6 border border-gold/20">
              <BookOpen className="text-gold mb-3" size={32} />
              <h3 className="text-xl font-bold text-gold mb-2">Transform</h3>
              <p className="text-text-secondary">
                We believe broken things can be fixed and lost people can find their way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gold mb-6 font-serif">Our Values</h2>
          <ul className="space-y-4 text-lg text-text-secondary">
            <li className="flex gap-3">
              <span className="text-gold font-bold">•</span>
              <span><strong className="text-gold">No Judgment.</strong> We don't judge. We listen. We care.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-bold">•</span>
              <span><strong className="text-gold">Real Talk.</strong> We speak truth with compassion. No sugarcoating.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-bold">•</span>
              <span><strong className="text-gold">Jesus First.</strong> Everything we do points back to Jesus Christ.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-bold">•</span>
              <span><strong className="text-gold">Community.</strong> You're not alone. We're in this together.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-bold">•</span>
              <span><strong className="text-gold">Action.</strong> We don't just talk. We provide resources and help.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-secondary text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gold mb-6 font-serif">Join Us</h2>
          <p className="text-lg text-text-secondary mb-8">
            Whether you're in crisis, searching for meaning, or just need to know someone cares—you belong here.
          </p>
          <Link
            to="/prayer"
            className="inline-block bg-gold text-dark px-8 py-3 rounded font-bold hover:bg-gold/90 transition-colors"
          >
            Get Involved
          </Link>
        </div>
      </section>
    </div>
  );
}
