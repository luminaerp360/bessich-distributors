import type { VercelRequest, VercelResponse } from '@vercel/node';

const imageCache = new Map<string, { buffer: Buffer; contentType: string; cachedAt: number }>();

const ALLOWED_HOSTS = [
  'ke-thebar-business.agiza.io',
  'ke.thebar.com',
  's3.amazonaws.com',
  'res.cloudinary.com',
  'images.unsplash.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const rawUrl = req.query.url as string;
  if (!rawUrl) {
    return res.status(400).send('Missing url parameter');
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return res.status(400).send('Invalid url parameter');
  }

  const isAllowed = ALLOWED_HOSTS.some(
    (h) => parsed.hostname === h || parsed.hostname.endsWith('.' + h) || parsed.hostname.includes('amazonaws')
  );
  if (!isAllowed) {
    return res.status(403).send('Forbidden target domain');
  }

  const cached = imageCache.get(rawUrl);
  if (cached && Date.now() - cached.cachedAt < 24 * 60 * 60 * 1000) {
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(cached.buffer);
  }

  try {
    const imgRes = await fetch(rawUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!imgRes.ok) {
      return res.status(imgRes.status).send(`Failed to load upstream image: HTTP ${imgRes.status}`);
    }

    const contentType = imgRes.headers.get('content-type') || 'image/png';
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (imageCache.size > 300) {
      const firstKey = imageCache.keys().next().value;
      if (firstKey) imageCache.delete(firstKey);
    }
    imageCache.set(rawUrl, { buffer, contentType, cachedAt: Date.now() });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(buffer);
  } catch (err: any) {
    return res.status(500).send(`Image proxy error: ${err.message}`);
  }
}
