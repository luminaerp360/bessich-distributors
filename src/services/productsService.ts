import { apiRequest } from './apiClient';
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { Product, ProductCategory } from '../types';

export interface ApiCategory {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface ApiProductVariant {
  id?: string;
  name?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
  attributes?: Record<string, unknown>;
}

export interface ApiProduct {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  categories?: string[];
  images?: string[];
  variants?: ApiProductVariant[];
  isActive?: boolean;
  featured?: boolean;
  brand?: string;
  specifications?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQuery {
  search?: string;
  isActive?: boolean;
  featured?: boolean;
  brand?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductVariantInput {
  name: string;
  sku: string;
  price: number;
  stockQuantity?: number;
  attributes?: Record<string, unknown>;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  categories: string[];
  brand: string;
  images?: string[];
  variants?: ProductVariantInput[];
  isActive?: boolean;
  featured?: boolean;
  specifications?: Record<string, unknown>;
}

export interface CategoryInput {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  parent?: string;
  tenantId?: string;
}

export interface NormalizedCatalog {
  products: Product[];
  categories: ApiCategory[];
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80';

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
  mixers: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
};

function normalizeImageUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return FALLBACK_IMAGE;
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  return `${API_BASE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

function mapCategoryNameToProductCategory(categoryName: string): ProductCategory {
  const lower = (categoryName || '').toLowerCase();
  if (lower.includes('whisky') || lower.includes('whiskey')) return 'whiskey';
  if (lower.includes('gin')) return 'gin';
  if (lower.includes('vodka')) return 'vodka';
  if (lower.includes('champagne')) return 'champagne';
  if (lower.includes('wine')) return 'wine';
  if (lower.includes('beer') || lower.includes('cider')) return 'beer_cider';
  if (lower.includes('rum')) return 'rum';
  if (lower.includes('brandy') || lower.includes('cognac')) return 'brandy';
  if (lower.includes('liqueur') || lower.includes('liquer')) return 'liqueur';
  if (lower.includes('spirit')) return 'spirits';
  return 'spirits';
}

function guessCategoryFromNameAndBrand(
  raw: ApiProduct,
  categoryNameById: Map<string, string>
): ProductCategory {
  const categoryIds = raw.categories ?? [];
  for (const id of categoryIds) {
    const name = categoryNameById.get(id);
    if (name) {
      const mapped = mapCategoryNameToProductCategory(name);
      if (mapped) return mapped;
    }
  }
  const haystack = `${raw.name} ${raw.brand ?? ''}`.toLowerCase();
  if (haystack.includes('whisky') || haystack.includes('whiskey')) return 'whiskey';
  if (haystack.includes('gin')) return 'gin';
  if (haystack.includes('vodka')) return 'vodka';
  if (haystack.includes('champagne')) return 'champagne';
  if (haystack.includes('wine')) return 'wine';
  if (haystack.includes('beer') || haystack.includes('cider')) return 'beer_cider';
  if (haystack.includes('rum')) return 'rum';
  if (haystack.includes('brandy') || haystack.includes('cognac')) return 'brandy';
  if (haystack.includes('liqueur') || haystack.includes('liquer')) return 'liqueur';
  return 'spirits';
}

function guessOrigin(raw: ApiProduct, category: ProductCategory): { origin: string; originFlag: string } {
  const specs = raw.specifications ?? {};
  const specOrigin = typeof specs.origin === 'string' ? specs.origin : '';
  const lower = `${raw.name} ${raw.brand ?? ''}`.toLowerCase();

  let origin = specOrigin || 'Imported';
  let originFlag = '🌍';

  if (category === 'whiskey') {
    if (lower.includes('jameson')) { origin = specOrigin || 'Dublin, Ireland'; originFlag = '🇮🇪'; }
    else if (lower.includes('jack daniel')) { origin = specOrigin || 'Lynchburg, Tennessee, USA'; originFlag = '🇺🇸'; }
    else if (lower.includes('japanese') || lower.includes('nikka') || lower.includes('hibiki')) { origin = specOrigin || 'Japan'; originFlag = '🇯🇵'; }
    else { origin = specOrigin || 'Scotland, UK'; originFlag = '🏴󠁧󠁢󠁳󠁣󠁴󠁿'; }
  } else if (category === 'wine') {
    origin = specOrigin || 'Western Cape, South Africa'; originFlag = '🇿🇦';
  } else if (category === 'champagne') {
    origin = specOrigin || 'Épernay, Champagne, France'; originFlag = '🇫🇷';
  } else if (category === 'brandy') {
    origin = specOrigin || (lower.includes('martell') ? 'Cognac, France' : 'Kenya');
    originFlag = lower.includes('martell') ? '🇫🇷' : '🇰🇪';
  } else if (category === 'beer_cider') {
    origin = specOrigin || 'Ruaraka, Nairobi, Kenya'; originFlag = '🇰🇪';
  } else if (category === 'gin' || category === 'vodka') {
    if (lower.includes('beefeater') || lower.includes('tanqueray') || lower.includes('gordon')) {
      origin = specOrigin || 'London, England'; originFlag = '🇬🇧';
    } else if (lower.includes('absolut')) {
      origin = specOrigin || 'Åhus, Sweden'; originFlag = '🇸🇪';
    } else {
      origin = specOrigin || 'Nairobi, Kenya'; originFlag = '🇰🇪';
    }
  }

  if (specOrigin) {
    if (/kenya/i.test(specOrigin)) originFlag = '🇰🇪';
    else if (/scotland|uk/i.test(specOrigin)) originFlag = '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
    else if (/ireland/i.test(specOrigin)) originFlag = '🇮🇪';
    else if (/usa|tennessee|america/i.test(specOrigin)) originFlag = '🇺🇸';
    else if (/france/i.test(specOrigin)) originFlag = '🇫🇷';
    else if (/south africa/i.test(specOrigin)) originFlag = '🇿🇦';
    else if (/sweden/i.test(specOrigin)) originFlag = '🇸🇪';
    else if (/japan/i.test(specOrigin)) originFlag = '🇯🇵';
    else if (/england/i.test(specOrigin)) originFlag = '🇬🇧';
  }

  return { origin, originFlag };
}

export function normalizeApiProduct(
  raw: ApiProduct,
  categoryNameById: Map<string, string>,
  index: number
): Product {
  const id = raw._id ?? raw.id ?? `eco-${index}`;
  const category = guessCategoryFromNameAndBrand(raw, categoryNameById);
  const casePack =
    category === 'beer_cider' ? 24 : category === 'wine' || category === 'champagne' ? 6 : 12;

  const specs = raw.specifications ?? {};
  const volumeMl =
    typeof specs.volumeMl === 'number'
      ? specs.volumeMl
      : typeof specs.volume === 'number'
      ? (specs.volume as number)
      : 750;

  const abv =
    typeof specs.abv === 'number'
      ? (specs.abv as number)
      : category === 'beer_cider'
      ? 4.5
      : category === 'wine' || category === 'champagne'
      ? 13.5
      : 40;

  const primaryVariant = raw.variants?.[0];
  const variantPrice =
    typeof primaryVariant?.price === 'number' ? (primaryVariant.price as number) : undefined;
  const topPrice = typeof raw.price === 'number' ? raw.price : undefined;
  // The e-commerce `price` field is the authoritative/final price (managed in the
  // e-commerce admin portal). Use it as-is; only fall back to the variant price
  // when the product has no top-level price set.
  const bottlePrice = topPrice && topPrice > 0 ? topPrice : variantPrice ?? 0;

  const stockQuantity =
    typeof primaryVariant?.stockQuantity === 'number'
      ? (primaryVariant.stockQuantity as number)
      : 0;

  const image = normalizeImageUrl(raw.images?.[0]);
  const fallback = CATEGORY_IMAGE_MAP[category] || FALLBACK_IMAGE;
  const { origin, originFlag } = guessOrigin(raw, category);

  const sku =
    primaryVariant?.sku ||
    `ECO-${String(id).replace(/\s+/g, '-').slice(0, 12).toUpperCase()}`;

  return {
    id: String(id),
    sku,
    name: raw.name,
    brand: raw.brand || 'Bessich Select',
    category,
    subcategory: category.replace('_', ' ').toUpperCase(),
    origin,
    originFlag,
    abv,
    volumeMl,
    casePack,
    bottlePriceKes: bottlePrice,
    casePriceKes: bottlePrice * casePack,
    tiers: [
      { minCases: 5, discountPercentage: 3 },
      { minCases: 15, discountPercentage: 6 },
      { minCases: 30, discountPercentage: 10 },
    ],
    moqCases: category === 'beer_cider' ? 2 : 1,
    inStock: raw.isActive !== false && stockQuantity > 0,
    stockCases: stockQuantity,
    kraStampVerified: false,
    image,
    rawImage: raw.images?.[0] ? normalizeImageUrl(raw.images[0]) : undefined,
    fallbackImage: fallback,
    description: raw.description || `${raw.name} — wholesale commercial supply.`,
    featured: raw.featured ?? false,
    apiCategoryIds: (raw.categories ?? []).map((c) => String(c)),
  };
}

function buildCategoryIdMap(categories: ApiCategory[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const cat of categories) {
    const id = cat._id ?? cat.id;
    if (id) map.set(String(id), cat.name);
  }
  return map;
}

function buildQueryString(query: ProductQuery = {}): string {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.isActive !== undefined) params.set('isActive', String(query.isActive));
  if (query.featured !== undefined) params.set('featured', String(query.featured));
  if (query.brand) params.set('brand', query.brand);
  if (query.categories?.length) params.set('categories', query.categories.join(','));
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return apiRequest<ApiCategory[]>(API_ENDPOINTS.categories);
}

export function getApiId(item: { _id?: string; id?: string }): string {
  return String(item._id ?? item.id ?? '');
}

export function getApiCategoryId(cat: ApiCategory): string {
  return getApiId(cat) || cat.name;
}

export async function fetchProducts(query: ProductQuery = {}): Promise<ApiProduct[]> {
  return apiRequest<ApiProduct[]>(`${API_ENDPOINTS.products}${buildQueryString(query)}`);
}

export async function fetchProductById(id: string, token?: string | null): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(`${API_ENDPOINTS.products}/${encodeURIComponent(id)}`, { token });
}

export async function createProduct(payload: ProductInput, token?: string | null): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(API_ENDPOINTS.products, {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductInput>,
  token?: string | null
): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(`${API_ENDPOINTS.products}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: payload,
    token,
  });
}

export async function deleteProduct(id: string, token?: string | null): Promise<void> {
  await apiRequest<void>(`${API_ENDPOINTS.products}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    token,
  });
}

export async function toggleProductFeatured(id: string, token?: string | null): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(
    `${API_ENDPOINTS.products}/${encodeURIComponent(id)}/toggle-featured`,
    { method: 'PATCH', token }
  );
}

export async function createCategory(payload: CategoryInput, token?: string | null): Promise<ApiCategory> {
  return apiRequest<ApiCategory>(API_ENDPOINTS.categories, {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryInput>,
  token?: string | null
): Promise<ApiCategory> {
  return apiRequest<ApiCategory>(`${API_ENDPOINTS.categories}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: payload,
    token,
  });
}

export async function deleteCategory(id: string, token?: string | null): Promise<void> {
  await apiRequest<void>(`${API_ENDPOINTS.categories}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    token,
  });
}

export async function fetchFeaturedProducts(): Promise<ApiProduct[]> {
  return apiRequest<ApiProduct[]>(API_ENDPOINTS.productsFeatured);
}

export async function fetchActiveProducts(): Promise<ApiProduct[]> {
  return apiRequest<ApiProduct[]>(API_ENDPOINTS.productsActive);
}

export async function fetchNormalizedCatalog(): Promise<NormalizedCatalog> {
  const [categories, rawProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  const categoryMap = buildCategoryIdMap(categories);
  const products = rawProducts.map((raw, index) =>
    normalizeApiProduct(raw, categoryMap, index)
  );

  return { products, categories };
}