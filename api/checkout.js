import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  voice: {
    name: '20-minute OpenClaw voice session',
    description: 'Talk to an AI expert about OpenClaw — ask anything, no jargon',
    amount: 800,
    successPath: '/success.html',
  },
  research: {
    name: 'OpenClaw raw research data',
    description: 'Full knowledge base text — copy and use with your own AI agents',
    amount: 399,
    successPath: '/success.html',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const type = req.query.type === 'research' ? 'research' : 'voice';
    const product = PRODUCTS[type];
    const tokenId = crypto.randomBytes(6).toString('hex');

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://askopenclaw.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}${product.successPath}?token=${tokenId}&type=${type}`,
      cancel_url: `${origin}/#pricing`,
      metadata: {
        token_id: tokenId,
        type: type,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
