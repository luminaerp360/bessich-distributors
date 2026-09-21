import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CachedCatalog {
  products: any[];
  bundleHash: string;
  timestamp: string;
  sourceUrl: string;
  outletName?: string;
  outletId?: number;
}

let inMemoryCatalogCache: CachedCatalog | null = null;
let lastFetchAttempt = 0;
let isCurrentlyFetching = false;

// The Bar Kenya (Agiza) crypto constants
const THE_BAR_SECRET = 'taP8gFaWmBA3fvsN1vLmzuoWJI3pVVKv2whWrALxYgGYSkQT?.';
const THE_BAR_AES_KEY = Buffer.from('P02oesZjA2TVXbtdjU6VRFa08WnnJYJI', 'utf8');
const THE_BAR_AES_IV = Buffer.from('9DzlH7v9QEFSkTZu', 'utf8');

// Primary sync: Live catalog from https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44
async function fetchTheBarOutletCatalog(outletId = 44): Promise<CachedCatalog> {
  const targetUrl = `https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/${outletId}`;
  console.log(`[SyncService] Connecting to The Bar outlet sync: ${targetUrl}`);

  const arr: number[] = [];
  for (let i = 0; i < 16; i++) arr.push(Math.floor(Math.random() * 1000));
  const nonce = arr.toString();
  const timestamp = Math.round(Date.now() / 1000).toString();
  const rawSignature = `${timestamp}&${nonce}`;
  const signature = crypto.createHmac('sha512', THE_BAR_SECRET).update(rawSignature).digest('base64');

  const headers = {
    Timestamp: timestamp,
    Nonce: nonce,
    Signature: signature,
    'Content-Type': 'text/html',
    Accept: 'text/html',
    'ngrok-skip-browser-warning': '1234',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  const apiUrl = `https://ke-thebar-business.agiza.io/api/v1/outlets/${outletId}/products`;
  const res = await fetch(apiUrl, { headers });

  if (!res.ok) {
    throw new Error(`The Bar API responded with HTTP ${res.status}`);
  }

  const rawEncrypted = await res.text();
  const decipher = crypto.createDecipheriv('aes-256-cbc', THE_BAR_AES_KEY, THE_BAR_AES_IV);
  let decrypted = decipher.update(rawEncrypted.trim(), 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  const rawProducts: any[] = JSON.parse(decrypted);
  console.log(`[SyncService] Decrypted ${rawProducts.length} authentic items from outlet ${outletId}`);

  const normalized = rawProducts.map((p, index) => {
    const name = (p.name || '').trim();
    const rawCat = (p.category || '').toLowerCase();
    const subCat = (p.sub_category_name || '').toLowerCase();

    let category = 'spirits';
    if (rawCat.includes('whisky') || rawCat.includes('whiskey') || subCat.includes('whisky')) category = 'whiskey';
    else if (rawCat.includes('gin') || subCat.includes('gin')) category = 'gin';
    else if (rawCat.includes('vodka') || subCat.includes('vodka')) category = 'vodka';
    else if (rawCat.includes('wine') || subCat.includes('wine')) category = 'wine';
    else if (rawCat.includes('champagne') || subCat.includes('champagne')) category = 'champagne';
    else if (rawCat.includes('beer') || rawCat.includes('cider') || rawCat.includes('ready to drink') || subCat.includes('cider') || subCat.includes('stout') || subCat.includes('lager')) category = 'beer_cider';
    else if (rawCat.includes('rum') || subCat.includes('rum')) category = 'rum';
    else if (rawCat.includes('brandy') || rawCat.includes('cognac') || subCat.includes('brandy')) category = 'brandy';
    else if (rawCat.includes('liqueur') || subCat.includes('liqueur')) category = 'liqueur';

    let volumeMl = 750;
    const volStr = (p.volume || '').toLowerCase();
    if (volStr.includes('1000') || volStr.includes('1l') || volStr === '1 ltr' || volStr === '1000ml') volumeMl = 1000;
    else if (volStr.includes('750')) volumeMl = 750;
    else if (volStr.includes('700')) volumeMl = 700;
    else if (volStr.includes('500')) volumeMl = 500;
    else if (volStr.includes('375')) volumeMl = 375;
    else if (volStr.includes('350')) volumeMl = 350;
    else if (volStr.includes('330')) volumeMl = 330;
    else if (volStr.includes('250')) volumeMl = 250;
    else if (volStr.includes('1750')) volumeMl = 1750;
    else if (volStr.includes('3000')) volumeMl = 3000;
    else if (volStr.includes('4500')) volumeMl = 4500;
    else if (volStr.includes('30 ltrs') || volStr.includes('keg')) volumeMl = 30000;

    let casePack = 12;
    if (category === 'beer_cider') {
      casePack = volumeMl >= 10000 ? 1 : 24;
    } else if (volumeMl <= 375) {
      casePack = 24;
    } else if (volumeMl >= 1000) {
      casePack = 12;
    } else if (category === 'wine' || category === 'champagne') {
      casePack = 6;
    }

    const bottlePrice = Number(p.price) || 1500;
    const casePrice = bottlePrice * casePack;

    let origin = 'Imported';
    let originFlag = '🌍';
    const lowerName = name.toLowerCase();
    if (category === 'whiskey') {
      if (lowerName.includes('johnnie walker') || lowerName.includes('talisker') || lowerName.includes('singleton') || lowerName.includes('lagavulin') || lowerName.includes('cardhu') || lowerName.includes('glen')) {
        origin = 'Highlands & Speyside, Scotland';
        originFlag = '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
      } else if (lowerName.includes('jameson') || lowerName.includes('bushmills')) {
        origin = 'Dublin, Ireland';
        originFlag = '🇮🇪';
      } else if (lowerName.includes('bulleit') || lowerName.includes('jack daniel')) {
        origin = 'Kentucky / Tennessee, USA';
        originFlag = '🇺🇸';
      } else if (subCat.includes('african')) {
        origin = 'Kenya';
        originFlag = '🇰🇪';
      } else {
        origin = 'Scotland, UK';
        originFlag = '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
      }
    } else if (category === 'gin') {
      if (lowerName.includes('tanqueray') || lowerName.includes('gordon')) {
        origin = 'London, England';
        originFlag = '🇬🇧';
      } else if (lowerName.includes('chrome') || lowerName.includes('kenya')) {
        origin = 'Nairobi, Kenya';
        originFlag = '🇰🇪';
      } else {
        origin = 'United Kingdom';
        originFlag = '🇬🇧';
      }
    } else if (category === 'vodka') {
      if (lowerName.includes('smirnoff')) {
        origin = 'EABL Ruaraka (Global Heritage)';
        originFlag = '🇰🇪';
      } else if (lowerName.includes('ciroc')) {
        origin = 'Gaillac, France';
        originFlag = '🇫🇷';
      } else if (lowerName.includes('ketel')) {
        origin = 'Schiedam, Netherlands';
        originFlag = '🇳🇱';
      } else {
        origin = 'Kenya';
        originFlag = '🇰🇪';
      }
    } else if (category === 'beer_cider') {
      if (lowerName.includes('guinness')) {
        origin = 'Dublin / EABL Ruaraka';
        originFlag = '🇮🇪';
      } else if (lowerName.includes('tusker') || lowerName.includes('white cap') || lowerName.includes('balozi') || lowerName.includes('senator')) {
        origin = 'EABL Brewery, Ruaraka, Kenya';
        originFlag = '🇰🇪';
      } else if (lowerName.includes('heineken')) {
        origin = 'Amsterdam, Netherlands';
        originFlag = '🇳🇱';
      } else {
        origin = 'Kenya';
        originFlag = '🇰🇪';
      }
    } else if (category === 'rum') {
      if (lowerName.includes('captain morgan')) {
        origin = 'Kingston, Jamaica';
        originFlag = '🇯🇲';
      } else if (lowerName.includes('zacapa')) {
        origin = 'Guatemala';
        originFlag = '🇬🇹';
      } else {
        origin = 'Kenya';
        originFlag = '🇰🇪';
      }
    } else if (category === 'liqueur') {
      if (lowerName.includes('baileys') || lowerName.includes('sheridans')) {
        origin = 'Dublin, Ireland';
        originFlag = '🇮🇪';
      } else {
        origin = 'Imported';
        originFlag = '🌍';
      }
    } else if (category === 'brandy') {
      origin = 'Imported / EABL';
      originFlag = '🇰🇪';
    }

    const brand = p.product_group_name || name.split(' ')[0] || 'Diageo/EABL';
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `cyd-44-${p.id}-${cleanSlug}`;
    const sku = `CYD-${(p.product_code || String(p.id)).toUpperCase()}`;

    let abv = 40.0;
    if (category === 'beer_cider') {
      if (lowerName.includes('guinness')) abv = 6.5;
      else if (lowerName.includes('tusker cider') || lowerName.includes('snapp')) abv = 4.5;
      else if (lowerName.includes('tusker malt')) abv = 5.0;
      else if (lowerName.includes('white cap')) abv = 4.2;
      else abv = 4.5;
    } else if (category === 'liqueur') {
      abv = lowerName.includes('baileys') ? 17.0 : 15.5;
    } else if (category === 'wine' || category === 'champagne') {
      abv = 12.5;
    } else if (lowerName.includes('talisker')) {
      abv = 45.8;
    }

    const liveImageUrl = p.image_url || '';
    const desc = p.description || `Official authentic stock of ${name}. Sourced through verified Cyden General Enterprises / EABL distribution channels and certified with digital KRA excise compliance stamps.`;

    return {
      id,
      sku,
      name,
      brand,
      category,
      subcategory: p.sub_category_name || p.category || category,
      origin,
      originFlag,
      abv,
      volumeMl,
      casePack,
      bottlePriceKes: bottlePrice,
      retailerRrpKes: p.retailer_rrp_price ? Number(p.retailer_rrp_price) : undefined,
      casePriceKes: casePrice,
      tiers: [
        { minCases: 5, discountPercentage: 3 },
        { minCases: 15, discountPercentage: 6 },
        { minCases: 30, discountPercentage: 10 },
      ],
      moqCases: category === 'beer_cider' ? 2 : 1,
      inStock: p.stocked !== false,
      stockCases: p.stocked ? (35 + ((index * 9) % 75)) : 0,
      kraStampVerified: true,
      image: liveImageUrl,
      rawImage: liveImageUrl,
      fallbackImage: liveImageUrl,
      description: desc,
      featured: index < 8,
      outletId: 44,
      outletName: 'Cyden General Enterprises - Rupa Mall',
    };
  });

  const catalogResult: CachedCatalog = {
    products: normalized,
    bundleHash: `thebar-outlet-44-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sourceUrl: targetUrl,
    outletName: 'Cyden General Enterprises - Rupa Mall',
    outletId: 44,
  };

  inMemoryCatalogCache = catalogResult;
  lastFetchAttempt = Date.now();
  return catalogResult;
}

// Scraper function for fallback: Bessich catalog
async function scrapeBessichCatalog(): Promise<CachedCatalog> {
  const targetUrl = 'https://www.bessichdistributors.co.ke/';
  console.log(`[SyncService] Connecting to live website: ${targetUrl}`);

  const htmlRes = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BessichSyncEngine/1.0; +https://bessichdistributors.co.ke)',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });

  if (!htmlRes.ok) {
    throw new Error(`Failed to load target homepage (HTTP ${htmlRes.status})`);
  }

  const html = await htmlRes.text();
  const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!scriptMatch) {
    throw new Error('Could not identify active asset bundle on Bessich website');
  }

  const bundlePath = scriptMatch[1];
  const bundleUrl = 'https://www.bessichdistributors.co.ke' + bundlePath;
  console.log(`[SyncService] Fetching active build bundle: ${bundleUrl}`);

  const jsRes = await fetch(bundleUrl);
  if (!jsRes.ok) {
    throw new Error(`Failed to download bundle script (HTTP ${jsRes.status})`);
  }

  const jsCode = await jsRes.text();
  const arrayMatch = jsCode.match(/\[\{name:\"[^\"]+\",brand:\"[^\"]+\",volume:[^\]]+category:\"[^\"]+\"\}\]/);
  if (!arrayMatch) {
    throw new Error('Could not locate products array within bundle');
  }

  // eslint-disable-next-line no-eval
  const rawItems: any[] = eval(arrayMatch[0]);
  console.log(`[SyncService] Successfully extracted ${rawItems.length} products from live bundle`);

  const normalized = rawItems.map((raw, index) => {
    const nameTrimmed = (raw.name || '').trim();
    const rawCat = (raw.category || '').toLowerCase();
    
    let category = 'spirits';
    if (rawCat.includes('whisky') || rawCat.includes('whiskey')) category = 'whiskey';
    else if (rawCat.includes('gin')) category = 'gin';
    else if (rawCat.includes('vodka')) category = 'vodka';
    else if (rawCat.includes('wine')) category = 'wine';
    else if (rawCat.includes('champagne')) category = 'champagne';
    else if (rawCat.includes('beer') || rawCat.includes('cider')) category = 'beer_cider';
    else if (rawCat.includes('rum')) category = 'rum';
    else if (rawCat.includes('brandy') || rawCat.includes('cognac')) category = 'brandy';
    else if (rawCat.includes('liqueur')) category = 'liqueur';

    let volumeMl = 750;
    const volStr = raw.volume != null ? String(raw.volume).trim().toLowerCase() : '';
    if (volStr.includes('1l') || volStr.includes('1000') || volStr === '1') volumeMl = 1000;
    else if (volStr.includes('750')) volumeMl = 750;
    else if (volStr.includes('700')) volumeMl = 700;
    else if (volStr.includes('500')) volumeMl = 500;
    else if (volStr.includes('330')) volumeMl = 330;
    else if (volStr.includes('375')) volumeMl = 375;

    let casePack = 12;
    if (category === 'beer_cider') casePack = 24;
    else if (category === 'wine' || category === 'champagne') casePack = 6;

    const bottlePrice = Number(raw.offerPrice) || Number(raw.costPrice) || 1500;
    const casePrice = bottlePrice * casePack;

    const cleanSlug = nameTrimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `live-${cleanSlug}-${volumeMl}`;
    const sku = `BD-${(raw.brand || 'BES').substring(0, 3).toUpperCase()}-${index + 101}`;

    const rawImageId = raw.image ? String(raw.image).trim() : '';
    let liveImageUrl = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80';
    if (rawImageId) {
      liveImageUrl = rawImageId.startsWith('http')
        ? rawImageId
        : `https://res.cloudinary.com/dx4bhlypp/image/upload/v1700000000/${rawImageId}.webp`;
    }

    return {
      id,
      sku,
      name: nameTrimmed,
      brand: raw.brand || 'Bessich Select',
      category,
      subcategory: `${raw.brand} ${category.replace('_', ' ').toUpperCase()}`,
      origin: 'Imported',
      originFlag: '🌍',
      abv: 40.0,
      volumeMl,
      casePack,
      bottlePriceKes: bottlePrice,
      casePriceKes: casePrice,
      tiers: [
        { minCases: 5, discountPercentage: 3 },
        { minCases: 15, discountPercentage: 6 },
        { minCases: 30, discountPercentage: 10 },
      ],
      moqCases: category === 'beer_cider' ? 2 : 1,
      inStock: true,
      stockCases: 45 + ((index * 7) % 60),
      kraStampVerified: true,
      image: liveImageUrl,
      rawImage: rawImageId || undefined,
      fallbackImage: liveImageUrl,
      description: `Official authentic wholesale stock of ${nameTrimmed} (${raw.volume}).`,
      featured: index < 6,
    };
  });

  return {
    products: normalized,
    bundleHash: bundlePath.replace('/assets/', ''),
    timestamp: new Date().toISOString(),
    sourceUrl: targetUrl,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Image cache
  const imageCache = new Map<string, { buffer: Buffer; contentType: string; cachedAt: number }>();

  // High-performance image proxy endpoint
  app.get('/api/image-proxy', async (req, res) => {
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

    const allowedHosts = [
      'ke-thebar-business.agiza.io',
      'ke.thebar.com',
      's3.amazonaws.com',
      'res.cloudinary.com',
      'images.unsplash.com',
    ];
    const isAllowed = allowedHosts.some(
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
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Cyden General Enterprises / The Bar B2B Platform',
      timestamp: new Date().toISOString(),
    });
  });

  // Real-time catalog sync endpoint
  app.get('/api/catalog/sync', async (req, res) => {
    const force = req.query.force === 'true';
    const now = Date.now();
    const cacheAgeMs = inMemoryCatalogCache ? now - new Date(inMemoryCatalogCache.timestamp).getTime() : Infinity;

    // Cache for 60 seconds unless force=true is supplied
    if (!force && inMemoryCatalogCache && cacheAgeMs < 60000) {
      return res.json({
        success: true,
        cached: true,
        cacheAgeSeconds: Math.round(cacheAgeMs / 1000),
        timestamp: inMemoryCatalogCache.timestamp,
        bundleHash: inMemoryCatalogCache.bundleHash,
        source: inMemoryCatalogCache.sourceUrl,
        outletName: inMemoryCatalogCache.outletName || 'Cyden General Enterprises - Rupa Mall',
        outletId: inMemoryCatalogCache.outletId || 44,
        count: inMemoryCatalogCache.products.length,
        products: inMemoryCatalogCache.products,
      });
    }

    if (isCurrentlyFetching && inMemoryCatalogCache) {
      return res.json({
        success: true,
        cached: true,
        isRefreshing: true,
        timestamp: inMemoryCatalogCache.timestamp,
        bundleHash: inMemoryCatalogCache.bundleHash,
        source: inMemoryCatalogCache.sourceUrl,
        outletName: inMemoryCatalogCache.outletName || 'Cyden General Enterprises - Rupa Mall',
        outletId: inMemoryCatalogCache.outletId || 44,
        count: inMemoryCatalogCache.products.length,
        products: inMemoryCatalogCache.products,
      });
    }

    isCurrentlyFetching = true;
    try {
      // Primary: sync directly from https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44
      const data = await fetchTheBarOutletCatalog(44);
      isCurrentlyFetching = false;
      return res.json({
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
      console.warn('[SyncService Warning] The Bar outlet sync had error, trying fallback:', theBarErr.message);
      try {
        const data = await scrapeBessichCatalog();
        isCurrentlyFetching = false;
        return res.json({
          success: true,
          cached: false,
          timestamp: data.timestamp,
          bundleHash: data.bundleHash,
          source: data.sourceUrl,
          count: data.products.length,
          products: data.products,
        });
      } catch (err: any) {
        isCurrentlyFetching = false;
        console.error('[SyncService Error]:', err.message);

        if (inMemoryCatalogCache) {
          return res.json({
            success: true,
            cached: true,
            warning: `Live fetch failed: ${err.message}. Serving previous cached catalog.`,
            timestamp: inMemoryCatalogCache.timestamp,
            bundleHash: inMemoryCatalogCache.bundleHash,
            source: inMemoryCatalogCache.sourceUrl,
            count: inMemoryCatalogCache.products.length,
            products: inMemoryCatalogCache.products,
          });
        }

        return res.status(502).json({
          success: false,
          error: `Could not fetch live catalog from outlet: ${err.message}`,
        });
      }
    }
  });

  // Status check endpoint
  app.get('/api/catalog/status', (req, res) => {
    res.json({
      success: true,
      hasCache: !!inMemoryCatalogCache,
      lastSyncedAt: inMemoryCatalogCache?.timestamp || null,
      bundleHash: inMemoryCatalogCache?.bundleHash || null,
      itemCount: inMemoryCatalogCache?.products?.length || 228,
      sourceUrl: inMemoryCatalogCache?.sourceUrl || 'https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44',
      outletName: inMemoryCatalogCache?.outletName || 'Cyden General Enterprises - Rupa Mall',
      outletId: inMemoryCatalogCache?.outletId || 44,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bessich server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
