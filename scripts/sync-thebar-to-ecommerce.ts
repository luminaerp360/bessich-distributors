import { fetchTheBarOutletCatalog } from '../api/_lib/outlet-sync';

const API_BASE = 'https://ecommerse.lumina360.tech';
const TENANT = 'bessich-dist';

const PROVIDED_TOKEN = process.env.BESSICH_TOKEN || '';
const ADMIN_EMAIL = process.env.BESSICH_ADMIN_EMAIL || 'admin@bessichdistributors.co.ke';
const ADMIN_PASSWORD = process.env.BESSICH_ADMIN_PASSWORD || 'Bessich@Admin2026!';

const CATEGORIES = [
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

interface ApiResponse {
  access_token?: string;
  accessToken?: string;
  [key: string]: unknown;
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

async function resolveToken(): Promise<string> {
  if (PROVIDED_TOKEN) {
    console.log(`Using provided BESSICH_TOKEN (tenant: ${TENANT})`);
    return PROVIDED_TOKEN;
  }
  console.log(`No BESSICH_TOKEN provided — logging in as ${ADMIN_EMAIL}`);
  const login = await api<ApiResponse>('/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  return String(login.access_token ?? login.accessToken ?? '');
}

async function ensureCategories(token: string): Promise<Map<string, string>> {
  const existing = await api<Array<{ _id?: string; id?: string; name: string }>>('/categories', { token });
  const nameToId = new Map<string, string>();
  for (const c of existing) nameToId.set(c.name, String(c._id ?? c.id ?? ''));

  const keyToId = new Map<string, string>();
  for (const cat of CATEGORIES) {
    let id = nameToId.get(cat.name);
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
  return keyToId;
}

async function main() {
  const token = await resolveToken();
  if (!token) throw new Error('No access token available');

  console.log('Fetching products from The Bar (outlet 44)...');
  const catalog = await fetchTheBarOutletCatalog(44);
  const products = catalog.products;
  console.log(`Loaded ${products.length} products from The Bar outlet-44 (${catalog.sourceUrl})`);

  console.log('Ensuring categories exist...');
  const keyToId = await ensureCategories(token);

  const existingProducts = await api<Array<{ id?: string; name: string; brand?: string }>>('/products', { token });
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
      await api<{ id?: string; _id?: string }>('/products', {
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

  console.log('\n=== SYNC COMPLETE ===');
  console.log(`Products: ${createdCount} created, ${skippedCount} already existed, ${failedCount} failed`);
  console.log(`Tenant: ${TENANT}`);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});