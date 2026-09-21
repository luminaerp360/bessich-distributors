import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10');
  return res.status(200).json({
    status: 'ok',
    service: 'Bessich Distributors & The Bar Outlet Sync Engine',
    outletId: 44,
    outletName: 'Cyden General Enterprises - Rupa Mall',
  });
}
