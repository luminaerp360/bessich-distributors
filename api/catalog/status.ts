import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=10');
  return res.status(200).json({
    success: true,
    outletId: 44,
    outletName: 'Cyden General Enterprises - Rupa Mall',
    sourceUrl: 'https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44',
  });
}
