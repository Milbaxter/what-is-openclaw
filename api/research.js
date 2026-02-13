import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

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

  if (tokenData.type !== 'research') {
    return res.status(403).json({ error: 'This token is not for research access' });
  }

  res.status(200).json({ valid: true });
}
