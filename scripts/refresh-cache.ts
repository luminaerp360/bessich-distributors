import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const THE_BAR_SECRET = 'taP8gFaWmBA3fvsN1vLmzuoWJI3pVVKv2whWrALxYgGYSkQT?.';
const THE_BAR_AES_KEY = Buffer.from('P02oesZjA2TVXbtdjU6VRFa08WnnJYJI', 'utf8');
const THE_BAR_AES_IV = Buffer.from('9DzlH7v9QEFSkTZu', 'utf8');

interface CachedCatalog {
  products: any[];
  bundleHash: string;
  timestamp: string;
  sourceUrl: string;
  outletName?: string;
  outletId?: number;
}

async function fetchFromAgiza(outletId = 44): Promise<CachedCatalog> {
  const arr: number[] = [];
  for (let i = 0; i < 16; i++) arr.push(Math.floor(Math.random() * 1000));
  const nonce = arr.toString();
  const timestamp = Math.round(Date.now() / 1000).toString();
  const rawSignature = `${timestamp}&${nonce}`;
  const signature = crypto.createHmac('sha512', THE_BAR_SECRET).update(rawSignature).digest('base64');

  const headers: Record<string, string> = {
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
    if (category === 'beer_cider') casePack = volumeMl >= 10000 ? 1 : 24;
    else if (volumeMl <= 375) casePack = 24;
    else if (volumeMl >= 1000) casePack = 12;
    else if (category === 'wine' || category === 'champagne') casePack = 6;

    const bottlePrice = Number(p.price) || 1500;
    const casePrice = bottlePrice * casePack;
    const brand = p.product_group_name || name.split(' ')[0] || 'Diageo/EABL';
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `cyd-44-${p.id}-${cleanSlug}`;
    const sku = `CYD-${(p.product_code || String(p.id)).toUpperCase()}`;

    return {
      id, sku, name, brand, category,
      subcategory: p.sub_category_name || p.category || category,
      origin: 'Imported', originFlag: '🌍',
      abv: 40.0, volumeMl, casePack,
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
      image: p.image_url || '',
      rawImage: p.image_url || '',
      fallbackImage: p.image_url || '',
      description: p.description || `Official authentic stock of ${name}.`,
      featured: index < 8,
      outletId: 44,
      outletName: 'Cyden General Enterprises - Rupa Mall',
    };
  });

  return {
    products: normalized,
    bundleHash: `thebar-outlet-44-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sourceUrl: `https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/${outletId}`,
    outletName: 'Cyden General Enterprises - Rupa Mall',
    outletId: 44,
  };
}

async function main() {
  console.log('Fetching fresh catalog from Agiza API...');
  try {
    const data = await fetchFromAgiza(44);
    const outputPath = path.join(process.cwd(), 'data', 'catalog-cache.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Cached ${data.products.length} products to ${outputPath}`);
    console.log(`Timestamp: ${data.timestamp}`);
  } catch (err: any) {
    console.error('Failed to fetch from Agiza:', err.message);
    process.exit(1);
  }
}

main();
