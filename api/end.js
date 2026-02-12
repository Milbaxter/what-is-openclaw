import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const STALE_SESSION_MS = 30 * 60 * 1000; // 30 minutes max

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || !/^[a-f0-9]{12}$/.test(token)) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  const raw = await redis.get(`token:${token}`);
  if (!raw) {
    return res.status(404).json({ error: 'Token not found' });
  }

  const tokenData = typeof raw === 'string' ? JSON.parse(raw) : raw;

  // No active session — nothing to end
  if (!tokenData.active || !tokenData.session_start) {
    return res.status(200).json({
      remaining: tokenData.remaining,
      elapsed: 0,
      message: 'No active session',
    });
  }

  // Calculate elapsed time using server clock
  const elapsedMs = Date.now() - tokenData.session_start;
  let elapsedSeconds = Math.ceil(elapsedMs / 1000);

  // Cap at stale session timeout (don't charge more than 30 min)
  if (elapsedMs > STALE_SESSION_MS) {
    elapsedSeconds = Math.ceil(STALE_SESSION_MS / 1000);
  }

  // Deduct time
  tokenData.remaining = Math.max(0, tokenData.remaining - elapsedSeconds);
  tokenData.active = false;
  tokenData.session_start = null;
  tokenData.last_used = Date.now();

  await redis.set(`token:${token}`, JSON.stringify(tokenData), { ex: 90 * 24 * 60 * 60 });

  res.status(200).json({
    remaining: tokenData.remaining,
    elapsed: elapsedSeconds,
  });
}
