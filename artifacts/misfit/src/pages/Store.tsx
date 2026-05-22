import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function Store() {
  const [cart, setCart] = useState<Array<{ product_id: string; variant_id: string; quantity: number }>>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['store-products'],
    queryFn: async () => {
      const res = await axios.get('/api/store/products');
      return res.data;
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (customerData: any) => {
      const res = await axios.post('/api/store/checkout', {
        items: cart,
        customer: customerData,
      });
      return res.data;
    },
  });

  const addToCart = (productId: string, variantId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId && item.variant_id === variantId);
      if (existing) {
        return prev.map(item =>
          item.product_id === productId && item.variant_id === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product_id: productId, variant_id: variantId, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">Misfit Ministries Store</h1>
          <p className="text-2xl text-text-secondary">
            Wear your faith. Support the mission. Every purchase funds Narcan distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products?.map((product: any) => (
                <div key={product.id} className="bg-surface p-6 rounded-lg">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0].src}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gold mb-2">{product.title}</h3>
                  <p className="text-text-secondary mb-4 text-sm">{product.description}</p>

                  {product.variants?.map((variant: any) => (
                    <div key={variant.id} className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-bold text-text-primary">{variant.title}</p>
                        <p className="text-gold font-bold">${(variant.price / 100).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id, variant.id)}
                        className="bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-surface p-6 rounded-lg h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-gold mb-4">Cart ({cart.length})</h2>

            {cart.length === 0 ? (
              <p className="text-text-secondary">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <p className="text-text-secondary">
                        {item.product_id} x {item.quantity}
                      </p>
                      <button
                        onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                        className="text-red hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gold text-dark px-4 py-3 rounded font-bold hover:bg-yellow-600 transition"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <CheckoutForm onSubmit={(data) => checkoutMutation.mutate(data)} />
                )}
              </>
            )}

            <p className="text-text-secondary text-xs mt-6">
              100% of proceeds fund Narcan distribution and Misfit First Responders training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Name"
        required
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className="w-full bg-dark-border text-text-primary px-3 py-2 rounded text-sm"
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        className="w-full bg-dark-border text-text-primary px-3 py-2 rounded text-sm"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={formData.phone}
        onChange={e => setFormData({ ...formData, phone: e.target.value })}
        className="w-full bg-dark-border text-text-primary px-3 py-2 rounded text-sm"
      />
      <button
        type="submit"
        className="w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition text-sm"
      >
        Pay with Stripe
      </button>
    </form>
  );
}
