import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tokenId = crypto.randomBytes(6).toString('hex');

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://whatisopenclaw.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: '20-minute OpenClaw voice session',
            description: 'Talk to an AI expert about OpenClaw — ask anything, no jargon',
          },
          unit_amount: 800,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success.html?token=${tokenId}`,
      cancel_url: `${origin}/#pricing`,
      metadata: {
        token_id: tokenId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
