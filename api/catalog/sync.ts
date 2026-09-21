import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchTheBarOutletCatalog } from '../_lib/outlet-sync';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const force = req.query.force === 'true';

  try {
    const data = await fetchTheBarOutletCatalog(44);

    res.setHeader('Cache-Control', force ? 'no-cache' : 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      success: true,
      cached: false,
      timestamp: data.timestamp,
      bundleHash: data.bundleHash,
      source: data.sourceUrl,
      outletName: data.outletName,
      outletId: data.outletId,
      count: data.products.length,
      products: data.products,
    });
  } catch (err: any) {
    console.error('[SyncService Error]:', err.message);
    return res.status(502).json({
      success: false,
      error: `Could not fetch live catalog: ${err.message}`,
    });
  }
}
