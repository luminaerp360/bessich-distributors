import { Product, CatalogSyncStatus } from '../types';
import { fetchNormalizedCatalog } from './productsService';

const STORAGE_KEY_PRODUCTS = 'bessich_ecommerce_catalog_products_v1';
const STORAGE_KEY_STATUS = 'bessich_ecommerce_catalog_status_v1';
export const DEFAULT_SOURCE_URL = 'https://ecommerse.lumina360.tech';
export const OUTLET_NAME = 'Lumina E-Commerce Platform';

export async function fetchLiveCatalog(force = false): Promise<{
  products: Product[];
  status: CatalogSyncStatus;
}> {
  // Primary source: Lumina e-commerce API (products managed in the admin portal)
  try {
    const { products } = await fetchNormalizedCatalog();
    const status: CatalogSyncStatus = {
      isSyncing: false,
      lastSyncedAt: new Date().toISOString(),
      itemCount: products.length,
      sourceUrl: DEFAULT_SOURCE_URL,
      error: null,
      isLive: true,
    };
    saveStoredCatalog(products, status);
    return { products, status };
  } catch (backendErr) {
    console.warn('E-commerce API catalog fetch failed, utilizing cached catalog:', backendErr);

    // Fallback: local storage cache of the last successful backend sync.
    const cached = getStoredCatalog();
    if (cached.products.length > 0) {
      return {
        products: cached.products,
        status: {
          ...cached.status,
          error: backendErr instanceof Error ? backendErr.message : 'Using cached live catalog',
          isLive: false,
        },
      };
    }

    const emptyStatus: CatalogSyncStatus = {
      isSyncing: false,
      lastSyncedAt: null,
      itemCount: 0,
      sourceUrl: DEFAULT_SOURCE_URL,
      error: backendErr instanceof Error ? backendErr.message : 'Catalog unavailable',
      isLive: false,
    };
    return { products: [], status: emptyStatus };
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
    products: [],
    status: {
      isSyncing: false,
      lastSyncedAt: null,
      itemCount: 0,
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