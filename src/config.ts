export const API_BASE_URL = 'https://ecommerse.lumina360.tech';

export const DEFAULT_TENANT_ID = 'bessich-dist';

export const API_ENDPOINTS = {
  signup: '/auth/signup',
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  me: '/users/me',
  products: '/products',
  productsActive: '/products/active',
  productsFeatured: '/products/featured',
  categories: '/categories',
  categoriesActive: '/categories/active',
} as const;