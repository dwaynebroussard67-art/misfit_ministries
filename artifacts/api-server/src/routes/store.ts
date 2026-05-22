import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getProducts, getProduct, createOrder } from '../utils/printify-client.js';

const router: ReturnType<typeof Router> = Router();

const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '1';

// GET /api/store/products - List all merchandise products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await getProducts(PRINTIFY_SHOP_ID);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/store/products/:id - Get single product
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await getProduct(PRINTIFY_SHOP_ID, req.params.id);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/store/checkout - Create order and return Stripe session
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      items: z.array(z.object({
        product_id: z.string(),
        variant_id: z.string(),
        quantity: z.number().min(1),
      })),
      customer: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
      }),
    });

    const parsed = schema.parse(req.body);

    // In production, this would:
    // 1. Create Printify order
    // 2. Create Stripe checkout session
    // 3. Link them together
    // 4. Return Stripe session URL

    res.json({
      success: true,
      message: 'Checkout session created',
      // stripe_session_url: 'https://checkout.stripe.com/...',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

export default router;
