import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const STALE_SESSION_MS = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

  // Safety net: auto-expire stale sessions (browser crash, tab left open)
  if (tokenData.active && tokenData.session_start) {
    const elapsed = Date.now() - tokenData.session_start;
    if (elapsed > STALE_SESSION_MS) {
      const elapsedSeconds = Math.min(
        Math.ceil(elapsed / 1000),
        Math.ceil(STALE_SESSION_MS / 1000)
      );
      tokenData.remaining = Math.max(0, tokenData.remaining - elapsedSeconds);
      tokenData.active = false;
      tokenData.session_start = null;
      await redis.set(`token:${token}`, JSON.stringify(tokenData), { ex: 90 * 24 * 60 * 60 });
    }
  }

  // No time left
  if (tokenData.remaining <= 0) {
    return res.status(403).json({ error: 'No time remaining', remaining: 0 });
  }

  // Concurrent session prevention
  if (tokenData.active) {
    return res.status(409).json({
      error: 'Session already active on another device',
      remaining: tokenData.remaining,
    });
  }

  // Mark session as active
  tokenData.active = true;
  tokenData.session_start = Date.now();
  await redis.set(`token:${token}`, JSON.stringify(tokenData), { ex: 90 * 24 * 60 * 60 });

  // Generate ElevenLabs signed URL
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API returned ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      signed_url: data.signed_url,
      remaining: tokenData.remaining,
    });
  } catch (err) {
    // Rollback active state on failure
    tokenData.active = false;
    tokenData.session_start = null;
    await redis.set(`token:${token}`, JSON.stringify(tokenData), { ex: 90 * 24 * 60 * 60 });

    console.error('ElevenLabs signed URL error:', err);
    res.status(500).json({ error: 'Failed to start session' });
  }
}
