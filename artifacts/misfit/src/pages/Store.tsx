import { useState } from 'react';
import { ShoppingBag, Heart, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PRODUCTS = [
  { id: 'price_prayer_support', name: 'Prayer Support', price: '$5.00', desc: 'Support our prayer ministry' },
  { id: 'price_monthly_support', name: 'Monthly Supporter', price: '$29.99/mo', desc: 'Monthly support' },
  { id: 'price_annual_support', name: 'Annual Supporter', price: '$299.99/yr', desc: 'Annual support' },
];

const MERCHANDISE = [
  { id: 'price_misfit_hoodie', name: 'Misfit Hoodie', price: '$39.99' },
  { id: 'price_misfit_shirt', name: 'Misfit T-Shirt', price: '$19.99' },
  { id: 'price_misfit_hat', name: 'Misfit Hat', price: '$14.99' },
];

export default function Store() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/api/stripe/checkout', {
        items: [{ priceId, quantity: 1 }],
      });
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (err) {
      setError('Failed to start checkout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-secondary to-dark">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gold mb-8 font-serif">Misfit Store</h1>
          <p className="text-xl text-text-secondary">Support the mission. Get exclusive gear.</p>
        </div>
      </section>

      {error && (
        <div className="bg-red/20 border border-red text-red p-4 mx-4 my-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gold mb-8 font-serif">Support the Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {PRODUCTS.map(product => (
              <div key={product.id} className="bg-dark-secondary rounded-lg p-6 border border-gold/20 hover:border-gold transition-colors">
                <Heart className="text-gold mb-3" size={32} />
                <h3 className="text-xl font-bold text-gold mb-2">{product.name}</h3>
                <p className="text-text-secondary mb-2 text-sm">{product.desc}</p>
                <p className="text-2xl font-bold text-gold mb-4">{product.price}</p>
                <button
                  onClick={() => handleCheckout(product.id)}
                  disabled={loading}
                  className="w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-gold/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Donate'}
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gold mb-8 font-serif">Official Merchandise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MERCHANDISE.map(item => (
              <div key={item.id} className="bg-dark-secondary rounded-lg p-6 border border-gold/20 hover:border-gold transition-colors">
                <ShoppingBag className="text-gold mb-3" size={32} />
                <h3 className="text-xl font-bold text-gold mb-2">{item.name}</h3>
                <p className="text-2xl font-bold text-gold mb-4">{item.price}</p>
                <button
                  onClick={() => handleCheckout(item.id)}
                  disabled={loading}
                  className="w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-gold/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark rounded-lg p-8 border border-gold/20">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="text-gold mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gold mb-2">100% of Proceeds Support the Mission</h3>
                <p className="text-text-secondary">
                  Every purchase directly supports our prayer ministry, crisis resources, and community outreach. Thank you for standing with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
