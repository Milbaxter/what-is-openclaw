import Stripe from 'stripe';
import { Redis } from '@upstash/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tokenId = session.metadata?.token_id;

    if (tokenId && session.payment_status === 'paid') {
      const existing = await redis.get(`token:${tokenId}`);
      if (!existing) {
        const tokenData = {
          id: tokenId,
          remaining: 1200,
          active: false,
          session_start: null,
          created_at: Date.now(),
          stripe_session_id: session.id,
        };

        await redis.set(`token:${tokenId}`, JSON.stringify(tokenData), { ex: 90 * 24 * 60 * 60 });

        console.log(`Token created: ${tokenId} (${tokenData.remaining}s)`);
      }
    }
  }

  res.status(200).json({ received: true });
}
