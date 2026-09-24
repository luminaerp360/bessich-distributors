import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_BASE = 'https://ecommerse.lumina360.tech';
const TENANT = 'bessich-dist';

// Bessich wholesale catalog config
const ADMIN_EMAIL = process.env.BESSICH_ADMIN_EMAIL || 'admin@bessichdistributors.co.ke';
const ADMIN_PASSWORD = process.env.BESSICH_ADMIN_PASSWORD || 'Bessich@Admin2026!';
const CUSTOMER_EMAIL = process.env.BESSICH_CUSTOMER_EMAIL || 'walkin@bessichdistributors.co.ke';
const CUSTOMER_PASSWORD = process.env.BESSICH_CUSTOMER_PASSWORD || 'Bessich@Retail2026!';

// Read the outlet-44 catalog cache (The Bar Kenya) — 228 products with images & specs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.resolve(__dirname, '../data/catalog-cache.json');

interface CacheProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  origin?: string;
  abv?: number;
  volumeMl?: number;
  casePack?: number;
  bottlePriceKes?: number;
  retailerRrpKes?: number;
  casePriceKes?: number;
  inStock?: boolean;
  stockCases?: number;
  kraStampVerified?: boolean;
  image?: string;
  description?: string;
  featured?: boolean;
}

async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-tenant-id': TENANT,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const raw = await res.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : `HTTP ${res.status}`;
    throw new Error(`${method} ${path} → ${message}`);
  }
  return data as T;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureUser(
  payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: string;
  }
): Promise<{ token: string; user: { _id?: string; id?: string; tenantId?: string; email: string } }> {
  // Try signup first; if the account already exists, fall back to login.
  try {
    const signup = await api<{
      access_token?: string;
      accessToken?: string;
      user?: { _id?: string; id?: string; tenantId?: string; email: string };
    }>('/auth/signup', { method: 'POST', body: payload });
    const token = String(signup.access_token ?? signup.accessToken ?? '');
    return { token, user: signup.user ?? { email: payload.email } };
  } catch {
    const login = await api<{
      access_token?: string;
      accessToken?: string;
      user?: { _id?: string; id?: string; tenantId?: string; email: string };
    }>('/auth/login', { method: 'POST', body: { email: payload.email, password: payload.password } });
    const token = String(login.access_token ?? login.accessToken ?? '');
    return { token, user: login.user ?? { email: payload.email } };
  }
}

async function main() {
  const cache: { products: CacheProduct[] } = JSON.parse(
    fs.readFileSync(CACHE_PATH, 'utf8')
  );
  const products = cache.products;
  console.log(`Loaded ${products.length} products from The Bar Kenya outlet-44 cache.`);

  // 1. Register/verify the Bessich admin (tenant: bessich-dist)
  const admin = await ensureUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    firstName: 'Bessich',
    lastName: 'Admin',
    phoneNumber: '+254795349039',
    role: 'admin',
  });
  console.log(`Admin ready: ${admin.user.email} (tenant ${admin.user.tenantId ?? TENANT})`);
  const token = admin.token;

  // 2. Register/verify a walk-in retail customer (tenant: bessich-dist)
  const customer = await ensureUser({
    email: CUSTOMER_EMAIL,
    password: CUSTOMER_PASSWORD,
    firstName: 'Bessich',
    lastName: 'Retail',
    phoneNumber: '+254700000000',
    role: 'customer',
  });
  console.log(`Customer ready: ${customer.user.email} (tenant ${customer.user.tenantId ?? TENANT})`);

  // 3. Create categories (created once; the API stores them globally)
  const categoryNames = [
    { name: 'Whiskey', key: 'whiskey', description: 'Scotch, Irish, bourbon and Japanese whiskies' },
    { name: 'Gin', key: 'gin', description: 'London dry and botanical gins' },
    { name: 'Vodka', key: 'vodka', description: 'Pure and flavoured vodkas' },
    { name: 'Rum', key: 'rum', description: 'White, golden and dark rums' },
    { name: 'Brandy & Cognac', key: 'brandy', description: 'Brandies and cognacs' },
    { name: 'Liqueur', key: 'liqueur', description: 'Cream and fruit liqueurs' },
    { name: 'Spirits', key: 'spirits', description: 'Other spirits and specialities' },
    { name: 'Beer & Cider', key: 'beer_cider', description: 'Lagers, pilsners, stouts, ciders and RTDs' },
    { name: 'Wine', key: 'wine', description: 'Red, white and rosé wines' },
    { name: 'Champagne', key: 'champagne', description: 'Champagnes and sparkling wines' },
  ];
  const existingCategories = await api<Array<{ _id?: string; id?: string; name: string }>>('/categories');
  const categoryIdByName = new Map<string, string>();
  for (const c of existingCategories) {
    categoryIdByName.set(c.name, String(c._id ?? c.id ?? ''));
  }

  const keyToId = new Map<string, string>();
  for (const cat of categoryNames) {
    let id = categoryIdByName.get(cat.name);
    if (!id) {
      const created = await api<{ _id?: string; id?: string }>('/categories', {
        method: 'POST',
        body: { name: cat.name, description: cat.description, isActive: true },
        token,
      });
      id = String(created._id ?? created.id ?? '');
      console.log(`  + created category: ${cat.name} (${id})`);
      await sleep(150);
    } else {
      console.log(`  = exists category: ${cat.name} (${id})`);
    }
    keyToId.set(cat.key, id);
  }

  // 4. Create products (idempotent: skip when a matching brand+name already exists)
  const existingProducts = await api<Array<{ id?: string; name: string; brand?: string }>>('/products');
  const existingNames = new Set(existingProducts.map((p) => p.name.trim().toLowerCase()));

  let createdCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const p of products) {
    const normalizedName = p.name.trim().toLowerCase();
    if (existingNames.has(normalizedName)) {
      skippedCount += 1;
      continue;
    }

    const categoryId = keyToId.get(p.category) ?? keyToId.get('spirits') ?? '';
    const price = Number(p.bottlePriceKes) || 0;
    const stockQuantity = Number(p.stockCases) || (p.inStock ? 10 : 0);

    const payload = {
      name: p.name,
      description: p.description || `${p.name} — wholesale commercial supply.`,
      price,
      categories: categoryId ? [categoryId] : [],
      images: p.image ? [p.image] : [],
      variants: [
        {
          name: `${p.volumeMl ?? 750}ml`,
          sku: p.sku || `BD-${p.category.toUpperCase()}-${Date.now()}`,
          price,
          stockQuantity,
          attributes: {
            volumeMl: p.volumeMl ?? 750,
            casePack: p.casePack ?? 12,
          },
        },
      ],
      isActive: true,
      featured: Boolean(p.featured),
      brand: p.brand || 'Bessich Select',
      specifications: {
        category: p.category,
        origin: p.origin || 'Imported',
        abv: p.abv ?? null,
        volumeMl: p.volumeMl ?? 750,
        casePack: p.casePack ?? 12,
        kraStampVerified: Boolean(p.kraStampVerified),
      },
    };

    try {
      const created = await api<{ id?: string; _id?: string }>('/products', {
        method: 'POST',
        body: payload,
        token,
      });
      createdCount += 1;
      existingNames.add(normalizedName);
      if (createdCount % 25 === 0) {
        console.log(`  ... ${createdCount} products created so far`);
      }
      await sleep(100);
    } catch (err) {
      failedCount += 1;
      console.error(`  ✗ failed: ${p.name} → ${err instanceof Error ? err.message : err}`);
      await sleep(300);
    }
  }

  console.log('\n=== SEED COMPLETE ===');
  console.log(`Products: ${createdCount} created, ${skippedCount} already existed, ${failedCount} failed`);
  console.log(`Tenant: ${TENANT}`);
  console.log(`Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Customer: ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});