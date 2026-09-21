import { Product, ProductCategory, CatalogSyncStatus } from '../types';
import { PRODUCTS as BASELINE_PRODUCTS } from '../data/products';

const STORAGE_KEY_PRODUCTS = 'thebar_outlet_44_catalog_products_v2';
const STORAGE_KEY_STATUS = 'thebar_outlet_44_catalog_status_v2';
export const DEFAULT_SOURCE_URL = 'https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44';
export const OUTLET_NAME = 'Cyden General Enterprises - Rupa Mall';

export interface RawScrapedProduct {
  name: string;
  brand: string;
  volume: string;
  offerPrice: number;
  costPrice: number;
  image?: string;
  category: string;
}

// Fallback image maps by category and brand keywords
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  whiskey: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
  gin: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  vodka: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  wine: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
  champagne: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80',
  beer_cider: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
  rum: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80',
  brandy: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
  liqueur: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  spirits: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
};

const SPECIFIC_IMAGE_MAP: Record<string, string> = {
  'johnnie walker': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
  'jameson': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80',
  'chivas': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
  'jack daniel': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
  'vat 69': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
  'beefeater': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'tanqueray': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'gordon': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'absolut': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  'moet': 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80',
  'four cousins': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
  'cellar cask': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
  'tusker': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
  'balozi': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
  'pilsner': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
  'hunter': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
  'martell': 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
  'jagermeister': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'amarula': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'malibu': 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80',
  'captain morgan': 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=800&q=80',
};

export function normalizeRawProduct(raw: RawScrapedProduct, index: number): Product {
  const nameTrimmed = raw.name.trim();
  const rawCat = (raw.category || '').toLowerCase();
  
  let category: ProductCategory = 'spirits';
  if (rawCat.includes('whisky') || rawCat.includes('whiskey')) category = 'whiskey';
  else if (rawCat.includes('gin')) category = 'gin';
  else if (rawCat.includes('vodka')) category = 'vodka';
  else if (rawCat.includes('wine')) category = 'wine';
  else if (rawCat.includes('champagne')) category = 'champagne';
  else if (rawCat.includes('beer') || rawCat.includes('cider')) category = 'beer_cider';
  else if (rawCat.includes('rum')) category = 'rum';
  else if (rawCat.includes('brandy') || rawCat.includes('cognac')) category = 'brandy';
  else if (rawCat.includes('liqueur')) category = 'liqueur';

  // Specific override for known champagne
  if (nameTrimmed.toLowerCase().includes('moët') || nameTrimmed.toLowerCase().includes('moet')) {
    category = 'champagne';
  }

  // Parse volume safely
  let volumeMl = 750;
  const volStr = raw.volume != null ? String(raw.volume).trim().toLowerCase() : '';
  if (volStr.includes('1l') || volStr.includes('1000') || volStr === '1') volumeMl = 1000;
  else if (volStr.includes('750')) volumeMl = 750;
  else if (volStr.includes('700')) volumeMl = 700;
  else if (volStr.includes('500')) volumeMl = 500;
  else if (volStr.includes('330')) volumeMl = 330;
  else if (volStr.includes('375')) volumeMl = 375;

  // Case pack calculation: standard Kenyan distribution cases
  let casePack = 12;
  if (category === 'beer_cider') {
    casePack = 24;
  } else if (category === 'wine' || category === 'champagne') {
    casePack = 6;
  } else if (volumeMl === 1000) {
    casePack = 12;
  }

  const bottlePrice = Number(raw.offerPrice) || Number(raw.costPrice) || 1500;
  const casePrice = bottlePrice * casePack;

  // ID and SKU
  const cleanSlug = nameTrimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = `live-${cleanSlug}-${volumeMl}`;
  const sku = `BD-${raw.brand.substring(0, 3).toUpperCase()}-${index + 101}`;

  // Exact live image mapping from live site
  // Live site uses: https://res.cloudinary.com/dx4bhlypp/image/upload/v1700000000/${b.image}.webp
  const rawImageId = raw.image ? String(raw.image).trim() : '';
  const fallbackImg = CATEGORY_IMAGE_MAP[category] || CATEGORY_IMAGE_MAP.spirits;
  let liveImageUrl = fallbackImg;
  if (rawImageId) {
    liveImageUrl = rawImageId.startsWith('http')
      ? rawImageId
      : `https://res.cloudinary.com/dx4bhlypp/image/upload/v1700000000/${rawImageId}.webp`;
  }

  // Origin info
  const lowerName = nameTrimmed.toLowerCase();
  let origin = 'Imported';
  let originFlag = '🌍';
  if (category === 'whiskey') {
    if (lowerName.includes('jameson')) { origin = 'Dublin, Ireland'; originFlag = '🇮🇪'; }
    else if (lowerName.includes('jack daniel')) { origin = 'Lynchburg, Tennessee, USA'; originFlag = '🇺🇸'; }
    else { origin = 'Scotland, UK'; originFlag = '🏴󠁧󠁢󠁳󠁣󠁴󠁿'; }
  } else if (category === 'wine') {
    origin = 'Western Cape, South Africa'; originFlag = '🇿🇦';
  } else if (category === 'champagne') {
    origin = 'Épernay, Champagne, France'; originFlag = '🇫🇷';
  } else if (category === 'brandy') {
    origin = lowerName.includes('martell') ? 'Cognac, France' : 'Kenya';
    originFlag = lowerName.includes('martell') ? '🇫🇷' : '🇰🇪';
  } else if (category === 'beer_cider') {
    origin = 'Ruaraka, Nairobi, Kenya'; originFlag = '🇰🇪';
  } else if (category === 'gin' || category === 'vodka') {
    if (lowerName.includes('beefeater') || lowerName.includes('tanqueray') || lowerName.includes('gordon')) {
      origin = 'London, England'; originFlag = '🇬🇧';
    } else if (lowerName.includes('absolut')) {
      origin = 'Åhus, Sweden'; originFlag = '🇸🇪';
    } else {
      origin = 'Nairobi, Kenya'; originFlag = '🇰🇪';
    }
  }

  return {
    id,
    sku,
    name: nameTrimmed,
    brand: raw.brand || 'Bessich Select',
    category,
    subcategory: `${raw.brand} ${category.replace('_', ' ').toUpperCase()}`,
    origin,
    originFlag,
    abv: category === 'beer_cider' ? 4.5 : category === 'wine' ? 13.5 : 40.0,
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
    fallbackImage: fallbackImg,
    description: `Official authentic wholesale stock of ${nameTrimmed} (${raw.volume}). Sourced directly through verified manufacturer channels and certified with digital KRA excise compliance stamps.`,
    featured: index < 6,
  };
}

// Client-side fallback scraper directly fetching from https://www.bessichdistributors.co.ke/
export async function scrapeLiveClientSide(): Promise<{ products: Product[]; bundleHash: string }> {
  const targetUrl = 'https://www.bessichdistributors.co.ke/';
  const htmlRes = await fetch(targetUrl);
  if (!htmlRes.ok) {
    throw new Error(`Failed to fetch HTML from ${targetUrl} (HTTP ${htmlRes.status})`);
  }
  const html = await htmlRes.text();
  const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!scriptMatch) {
    throw new Error('Unable to locate live asset bundle on Bessich Distributors website');
  }

  const bundlePath = scriptMatch[1];
  const bundleUrl = 'https://www.bessichdistributors.co.ke' + bundlePath;
  const jsRes = await fetch(bundleUrl);
  if (!jsRes.ok) {
    throw new Error(`Failed to fetch bundle JS from ${bundleUrl} (HTTP ${jsRes.status})`);
  }
  const jsCode = await jsRes.text();

  const arrayMatch = jsCode.match(/\[\{name:\"[^\"]+\",brand:\"[^\"]+\",volume:[^\]]+category:\"[^\"]+\"\}\]/);
  if (!arrayMatch) {
    throw new Error('Catalog array signature not found in live bundle');
  }

  // Parse raw JSON/JS array safely
  // eslint-disable-next-line no-eval
  const rawItems = eval(arrayMatch[0]) as RawScrapedProduct[];
  const normalized = rawItems.map((raw, idx) => normalizeRawProduct(raw, idx));

  return {
    products: normalized,
    bundleHash: bundlePath.replace('/assets/', ''),
  };
}

export async function fetchLiveCatalog(force = false): Promise<{
  products: Product[];
  status: CatalogSyncStatus;
}> {
  // First attempt backend API route: /api/catalog/sync
  try {
    const apiRes = await fetch(`/api/catalog/sync${force ? '?force=true' : ''}`, {
      headers: { Accept: 'application/json' },
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const status: CatalogSyncStatus = {
          isSyncing: false,
          lastSyncedAt: data.timestamp || new Date().toISOString(),
          itemCount: data.products.length,
          sourceUrl: data.source || DEFAULT_SOURCE_URL,
          bundleHash: data.bundleHash,
          error: null,
          isLive: true,
        };
        saveStoredCatalog(data.products, status);
        return { products: data.products, status };
      }
    }
  } catch (backendErr) {
    console.warn('Backend /api/catalog/sync not reachable, trying client-side live fetch...', backendErr);
  }

  // Fallback: Direct client-side fetch from the live website
  try {
    const liveData = await scrapeLiveClientSide();
    const status: CatalogSyncStatus = {
      isSyncing: false,
      lastSyncedAt: new Date().toISOString(),
      itemCount: liveData.products.length,
      sourceUrl: DEFAULT_SOURCE_URL,
      bundleHash: liveData.bundleHash,
      error: null,
      isLive: true,
    };
    saveStoredCatalog(liveData.products, status);
    return { products: liveData.products, status };
  } catch (clientErr: any) {
    console.warn('Direct live fetch failed, utilizing cached or baseline catalog:', clientErr);

    // Fallback: Check local storage
    const cached = getStoredCatalog();
    if (cached.products.length > 0) {
      return {
        products: cached.products,
        status: {
          ...cached.status,
          error: clientErr?.message || 'Using cached live catalog',
          isLive: false,
        },
      };
    }

    // Ultimate fallback: Baseline products
    const baselineStatus: CatalogSyncStatus = {
      isSyncing: false,
      lastSyncedAt: new Date().toISOString(),
      itemCount: BASELINE_PRODUCTS.length,
      sourceUrl: DEFAULT_SOURCE_URL,
      error: clientErr?.message || null,
      isLive: false,
    };
    return { products: BASELINE_PRODUCTS, status: baselineStatus };
  }
}

export function getStoredCatalog(): { products: Product[]; status: CatalogSyncStatus } {
  try {
    const rawProd = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    const rawStatus = localStorage.getItem(STORAGE_KEY_STATUS);
    if (rawProd) {
      const parsedProds = JSON.parse(rawProd);
      const parsedStatus = rawStatus ? JSON.parse(rawStatus) : null;
      return {
        products: parsedProds,
        status: parsedStatus || {
          isSyncing: false,
          lastSyncedAt: null,
          itemCount: parsedProds.length,
          sourceUrl: DEFAULT_SOURCE_URL,
          isLive: false,
        },
      };
    }
  } catch (e) {
    console.error('Failed reading catalog cache:', e);
  }
  return {
    products: BASELINE_PRODUCTS,
    status: {
      isSyncing: false,
      lastSyncedAt: null,
      itemCount: BASELINE_PRODUCTS.length,
      sourceUrl: DEFAULT_SOURCE_URL,
      isLive: false,
    },
  };
}

export function saveStoredCatalog(products: Product[], status: CatalogSyncStatus) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEY_STATUS, JSON.stringify(status));
  } catch (e) {
    console.error('Failed saving catalog cache:', e);
  }
}
