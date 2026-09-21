export type ProductCategory = 
  | 'all' 
  | 'whiskey' 
  | 'gin' 
  | 'vodka' 
  | 'wine' 
  | 'beer_cider' 
  | 'rum' 
  | 'brandy' 
  | 'champagne' 
  | 'spirits' 
  | 'liqueur' 
  | 'mixers';

export type ActivePage = 'home' | 'about' | 'catalog' | 'branches' | 'depots' | 'contact' | 'matrix' | 'portal' | 'pricelist';

export interface VolumeTier {
  minCases: number;
  discountPercentage: number;
}

export interface CatalogSyncStatus {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  itemCount: number;
  sourceUrl: string;
  bundleHash?: string;
  error?: string | null;
  isLive: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  origin: string;
  originFlag: string;
  abv: number; // e.g. 14.5
  volumeMl: number; // 750, 1000
  casePack: number; // e.g. 6 or 12 or 24 bottles per case
  bottlePriceKes: number;
  retailerRrpKes?: number;
  casePriceKes: number;
  tiers: VolumeTier[];
  moqCases: number; // Minimum Order Quantity in cases
  inStock: boolean;
  stockCases: number;
  kraStampVerified: boolean;
  image: string;
  rawImage?: string;
  fallbackImage?: string;
  description: string;
  tastingNotes?: string[];
  foodPairing?: string[];
  featured?: boolean;
  outletId?: number;
  outletName?: string;
}

export interface CartItem {
  product: Product;
  orderType: 'case' | 'bottle';
  quantity: number; // number of cases or bottles
}

export type BusinessType =
  | 'Bar & Lounge'
  | 'Restaurant'
  | 'Retail Liquor Store'
  | 'Hotel & Resort'
  | 'Supermarket / Hypermarket'
  | 'Event & Catering Company';

export type AccountTier = 'guest' | 'licensed_retailer' | 'premium_hospitality';

export interface B2BProfile {
  id: string;
  businessName: string;
  businessType: BusinessType;
  kraPin: string;
  liquorLicenseNumber: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: string;
  primaryDepot: string;
  tier: AccountTier;
  isVerified: boolean;
  creditLimitKes: number;
  availableCreditKes: number;
  paymentTermsDays: number; // 0 for COD, 14, or 30
}

export interface Depot {
  id: string;
  name: string;
  region: string;
  address: string;
  email: string;
  phone: string;
  manager: string;
  coverageAreas: string[];
  hours: string;
  isCentralHub?: boolean;
}

export interface B2BOrder {
  id: string;
  orderDate: string;
  poNumber?: string;
  items: CartItem[];
  subtotalKes: number;
  bulkDiscountKes: number;
  vatKes: number;
  deliveryFeeKes: number;
  totalKes: number;
  status: 'Pending Verification' | 'Order Confirmed' | 'Pallet Assembled' | 'Dispatched' | 'Delivered';
  paymentMethod: 'mpesa' | 'credit' | 'bank_transfer' | 'cod';
  paymentStatus: 'Paid' | 'Authorized on Credit' | 'Pending Payment';
  deliveryDate: string;
  deliverySlot: string;
  depotName: string;
  businessName: string;
}
