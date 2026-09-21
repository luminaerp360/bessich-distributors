import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchTheBarOutletCatalog, scrapeBessichCatalog, loadCachedCatalog } from '../_lib/outlet-sync';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const force = req.query.force === 'true';
  const cacheControl = force ? 'no-cache' : 'public, s-maxage=60, stale-while-revalidate=300';

  try {
    const data = await fetchTheBarOutletCatalog(44);

    res.setHeader('Cache-Control', cacheControl);
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
  } catch (theBarErr: any) {
    console.warn('[SyncService Warning] The Bar outlet sync failed, trying Bessich scraper:', theBarErr.message);

    try {
      const data = await scrapeBessichCatalog();

      res.setHeader('Cache-Control', cacheControl);
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
    } catch (scraperErr: any) {
      console.warn('[SyncService Warning] Bessich scraper failed, trying cached catalog file:', scraperErr.message);

      try {
        const data = await loadCachedCatalog();

        res.setHeader('Cache-Control', cacheControl);
        return res.status(200).json({
          success: true,
          cached: true,
          timestamp: data.timestamp,
          bundleHash: data.bundleHash,
          source: data.sourceUrl,
          outletName: data.outletName,
          outletId: data.outletId,
          count: data.products.length,
          products: data.products,
        });
      } catch (cacheErr: any) {
        console.error('[SyncService Error] All sources failed:', { theBarErr: theBarErr.message, scraperErr: scraperErr.message, cacheErr: cacheErr.message });
        return res.status(502).json({
          success: false,
          error: `All catalog sources failed. Agiza: ${theBarErr.message}. Scraper: ${scraperErr.message}. Cache: ${cacheErr.message}`,
        });
      }
    }
  }
}
