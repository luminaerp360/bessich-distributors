import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CatalogSection } from './components/CatalogSection';
// import { MatrixOrderPad } from './components/MatrixOrderPad';          // TODO: Admin-only
// import { B2BPortalSection } from './components/B2BPortalSection';      // TODO: Admin-only
import { DepotsSection } from './components/DepotsSection';
import { PriceListSection } from './components/PriceListSection';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
// import { ProductsAdmin } from './components/ProductsAdmin';
import { MyOrdersSection } from './components/MyOrdersSection';
// import { UsersAdmin } from './components/UsersAdmin';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
// import { CreditApplicationModal } from './components/CreditApplicationModal'; // TODO: Admin-only
// import { InvoiceViewerModal } from './components/InvoiceViewerModal';   // TODO: Admin-only
import { AgeGateModal } from './components/AgeGateModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { useAuth } from './context/AuthContext';

import { DEPOTS } from './data/depots';
import { Product, Depot, ActivePage, ProductCategory } from './types';
import { fetchLiveCatalog, getStoredCatalog } from './services/catalogSync';
import { applyPricingTierToProducts, PricingTier } from './utils/pricing';

import { CartItem, B2BProfile, B2BOrder } from './types';

const INITIAL_PROFILES: B2BProfile[] = [
  {
    id: 'B2B-ELD-4902',
    businessName: 'The Loft Lounge & Grill',
    businessType: 'Bar & Lounge',
    kraPin: 'P051884291A',
    liquorLicenseNumber: 'CLLB/UG/2026/0412',
    contactPerson: 'Brian Kiprop (Beverage Manager)',
    phoneNumber: '+254 712 345 678',
    email: 'purchasing@thelofteldoret.co.ke',
    deliveryAddress: 'Rupa Mills Mall, 3rd Floor, Malaba Rd, Eldoret',
    primaryDepot: 'Eldoret Central Jumbo House (HQ)',
    paymentTermsDays: 30,
    creditLimitKes: 1200000,
    availableCreditKes: 890000,
    isVerified: true,
    tier: 'premium_hospitality',
  },
  {
    id: 'B2B-ELD-8821',
    businessName: 'Rift Valley Spirits & Wine Wholesalers',
    businessType: 'Retail Liquor Store',
    kraPin: 'P051493021D',
    liquorLicenseNumber: 'CLLB/UG/2026/0188',
    contactPerson: 'Mercy Jebet (Proprietor)',
    phoneNumber: '+254 722 998 877',
    email: 'info@riftvalleyspirits.co.ke',
    deliveryAddress: 'Uganda Road, Near Zion Mall, Eldoret Town',
    primaryDepot: 'Town & Langas Distribution Depot',
    paymentTermsDays: 14,
    creditLimitKes: 600000,
    availableCreditKes: 410000,
    isVerified: true,
    tier: 'licensed_retailer',
  },
  {
    id: 'B2B-ELD-NEW',
    businessName: 'Unverified Guest / New Applicant',
    businessType: 'Event & Catering Company',
    kraPin: 'Pending Submission',
    liquorLicenseNumber: 'Pending Verification',
    contactPerson: 'New Commercial Buyer',
    phoneNumber: '+254 700 000 000',
    email: 'contact@caterer.co.ke',
    deliveryAddress: 'Eldoret CBD, Uasin Gishu',
    primaryDepot: 'Eldoret Central Jumbo House (HQ)',
    paymentTermsDays: 0,
    creditLimitKes: 0,
    availableCreditKes: 0,
    isVerified: false,
    tier: 'guest',
  },
];

const EMPTY_INITIAL_ORDERS: B2BOrder[] = [];

const PAGE_ROUTES: Record<ActivePage, string> = {
  home: '/',
  about: '/about',
  catalog: '/catalog',
  branches: '/branches',
  depots: '/depots',
  contact: '/contact',
  pricelist: '/price-list',
  orders: '/my-orders',
  matrix: '/matrix',
  portal: '/portal',
  admin: '/admin',
  users: '/users',
};

function pageFromPath(pathname: string): ActivePage {
  const path = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  const entry = Object.entries(PAGE_ROUTES).find(([, p]) => p === path);
  return entry ? (entry[0] as ActivePage) : 'home';
}

function navigateTo(page: ActivePage): void {
  window.history.pushState({}, '', PAGE_ROUTES[page]);
}

const CART_STORAGE_KEY = 'bessich_cart_v1';

function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveStoredCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — cart will not persist.
  }
}

// Builds illustrative sample orders from the live backend catalog (used only
// when the account has no real orders yet, for demo continuity).
function buildSampleOrders(products: Product[]): B2BOrder[] {
  if (products.length < 6) return [];
  const [p0, p1, p2, p3, p4, p5] = products;
  return [
    {
      id: 'BD-2026-98124',
      orderDate: '14 Sep 2026',
      poNumber: 'PO-LOFT-2026-081',
      items: [
        { product: p0, orderType: 'case', quantity: 5 },
        { product: p2, orderType: 'case', quantity: 3 },
        { product: p4, orderType: 'case', quantity: 4 },
      ],
      subtotalKes: 242000,
      bulkDiscountKes: 12100,
      vatKes: 33400,
      deliveryFeeKes: 0,
      totalKes: 229900,
      status: 'Delivered',
      paymentMethod: 'credit',
      paymentStatus: 'Authorized on Credit',
      deliveryDate: '15 Sep 2026',
      deliverySlot: 'Morning (08:00 - 12:00)',
      depotName: 'Eldoret Central Jumbo House (HQ)',
      businessName: 'The Loft Lounge & Grill',
    },
    {
      id: 'BD-2026-97410',
      orderDate: '02 Sep 2026',
      poNumber: 'PO-LOFT-2026-077',
      items: [
        { product: p1, orderType: 'case', quantity: 4 },
        { product: p3, orderType: 'case', quantity: 2 },
      ],
      subtotalKes: 147000,
      bulkDiscountKes: 7350,
      vatKes: 20400,
      deliveryFeeKes: 0,
      totalKes: 139650,
      status: 'Delivered',
      paymentMethod: 'mpesa',
      paymentStatus: 'Paid',
      deliveryDate: '03 Sep 2026',
      deliverySlot: 'Afternoon (13:00 - 17:00)',
      depotName: 'Eldoret Central Jumbo House (HQ)',
      businessName: 'The Loft Lounge & Grill',
    },
  ];
}

export default function App() {
  const { user: authUser, logout: handleLogout } = useAuth();

  // Pricing tier: registered customers get wholesale pricing by default;
  // guests (one-time buyers) see normal retail pricing.
  const pricingTier: PricingTier = authUser ? 'wholesale' : 'retail';
  const isWholesale = pricingTier === 'wholesale';

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActivePage>(() => pageFromPath(window.location.pathname));

  // Keep the active page in sync with browser back/forward navigation.
  useEffect(() => {
    const onPopState = () => setActiveTab(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  
  // Real-time catalog sync state — auto-synced silently in background
  const [products, setProducts] = useState<Product[]>(() => {
    // Source of truth: the Lumina e-commerce API catalog (managed in the admin portal).
    const cached = getStoredCatalog();
    return cached.products;
  });

  // Products displayed to the customer, priced for their tier.
  const displayProducts = React.useMemo(
    () => applyPricingTierToProducts(products, pricingTier),
    [products, pricingTier]
  );

  // Re-price cart items when the customer signs in/out or the catalog refreshes.
  const pricedProductsRef = React.useRef<Product[]>(displayProducts);
  pricedProductsRef.current = displayProducts;

  // Background live catalog sync on mount and auto-refresh every 3 minutes
  useEffect(() => {
    let isMounted = true;

    const performSync = async () => {
      try {
        const result = await fetchLiveCatalog(false);
        if (!isMounted) return;

        if (result.products.length > 0) {
          setProducts(result.products);
          // Seed illustrative sample orders from the live catalog once, only if
          // the account has no real orders yet.
          setOrders((prev) => (prev.length === 0 ? buildSampleOrders(result.products) : prev));
        }
      } catch {
        // Silent — catalog is backend-managed; empty state is handled by sections
      }
    };

    performSync();
    const interval = setInterval(performSync, 180000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Manual refresh triggered after admin catalog edits
  const refreshCatalog = useCallback(async () => {
    try {
      const result = await fetchLiveCatalog(true);
      if (result.products.length > 0) {
        setProducts(result.products);
      }
    } catch {
      // Silent
    }
  }, []);
  
  // Catalog search state
  const [searchQuery, setSearchQuery] = useState('');

  // Depots state
  const [activeDepot, setActiveDepot] = useState<Depot>(DEPOTS[0]);

  // Keep cart depot in sync with header depot selection
  useEffect(() => {
    setCartDepot(activeDepot);
  }, [activeDepot]);

  const handleNavigate = (page: ActivePage, _category?: ProductCategory) => {
    setActiveTab(page);
    navigateTo(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wrapper for header/footer nav clicks so the URL stays in sync.
  const handleSetTab = (page: ActivePage) => {
    setActiveTab(page);
    navigateTo(page);
  };

  // Product detail modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Dark / Light mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bessich_theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bessich_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bessich_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const [availableProfiles, setAvailableProfiles] = useState<B2BProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<B2BProfile>(INITIAL_PROFILES[0]);
  const [orders, setOrders] = useState<B2BOrder[]>(EMPTY_INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getStoredCart());

  // Persist the cart across page refreshes / sessions.
  useEffect(() => {
    saveStoredCart(cartItems);
  }, [cartItems]);

  // Re-price cart items when the customer signs in/out or the catalog refreshes.
  useEffect(() => {
    setCartItems((prev) =>
      prev.map((item) => {
        const base = pricedProductsRef.current.find((p) => p.id === item.product.id);
        return base ? { ...item, product: base } : item;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricingTier, products]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartDepot, setCartDepot] = useState<Depot>(DEPOTS[0]);
  const [poNumber, setPoNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<B2BOrder | null>(null);
  const [showProFormaQuote, setShowProFormaQuote] = useState(false);

  const handleAddToCart = (product: Product, orderType: 'case' | 'bottle', quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.orderType === orderType
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, orderType, quantity }];
    });
  };

  const handleAddBulkToCart = (newItems: CartItem[]) => {
    setCartItems((prev) => {
      const updated = [...prev];
      for (const newItem of newItems) {
        const idx = updated.findIndex(
          (item) => item.product.id === newItem.product.id && item.orderType === newItem.orderType
        );
        if (idx > -1) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + newItem.quantity };
        } else {
          updated.push(newItem);
        }
      }
      return updated;
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) { handleRemoveItem(index); return; }
    setCartItems((prev) => { const updated = [...prev]; updated[index] = { ...updated[index], quantity }; return updated; });
  };

  const handleRemoveItem = (index: number) => { setCartItems((prev) => prev.filter((_, i) => i !== index)); };
  const handleUpdateOrderType = (index: number, orderType: 'case' | 'bottle') => {
    setCartItems((prev) => {
      const updated = [...prev];
      if (updated[index]) updated[index] = { ...updated[index], orderType };
      return updated;
    });
  };
  const handleClearCart = () => { setCartItems([]); };

  const handleReorder = (order: B2BOrder) => {
    handleAddBulkToCart(order.items);
  };

  const handleOrderSuccess = (newOrder: B2BOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    if (newOrder.paymentMethod === 'credit') {
      setActiveProfile((prev) => ({
        ...prev,
        availableCreditKes: Math.max(0, prev.availableCreditKes - newOrder.totalKes),
      }));
    }
    setCartItems([]);
  };

  const handleCreditApproved = (updatedProfile: B2BProfile) => {
    setActiveProfile(updatedProfile);
    setAvailableProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0c0c14] text-gray-900 dark:text-[#FAF9F6] flex flex-col font-sans selection:bg-[#0E01B5] selection:text-white transition-colors duration-200">
      {/* Kenyan Legal Drinking Age Verification Modal */}
      <AgeGateModal />

      {/* B2B Account Login / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        activeDepot={activeDepot}
        allDepots={DEPOTS}
        onSelectDepot={setActiveDepot}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            products={displayProducts}
            onOpenDetails={setSelectedProductDetail}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection onNavigate={handleNavigate} />
        )}

        {activeTab === 'catalog' && (
          <CatalogSection
            products={displayProducts}
            onOpenDetails={setSelectedProductDetail}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            isWholesale={isWholesale}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {(activeTab === 'branches' || activeTab === 'depots') && (
          <DepotsSection
            depots={DEPOTS}
            activeDepot={activeDepot}
            onSelectDepot={(depot) => setActiveDepot(depot)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection onNavigate={handleNavigate} />
        )}

        {activeTab === 'pricelist' && (
          <PriceListSection products={displayProducts} onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'orders' && (
          authUser ? (
            <MyOrdersSection
              userId={String(authUser._id ?? authUser.id ?? '')}
              userName={[authUser.firstName, authUser.lastName].filter(Boolean).join(' ') || authUser.email}
              onReorder={handleReorder}
              onNavigateCatalog={() => handleNavigate('catalog')}
            />
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-display">
                Sign In to View Your Orders
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account holders can track their resale orders, history, and purchasing statistics.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="bg-[#0E01B5] hover:bg-[#09007A] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Sign In / Create Account
              </button>
            </div>
          )
        )}

        {/* TODO: Admin-only — product catalog is managed via the e-commerce admin portal
        {activeTab === 'admin' && (
          authUser ? (
            <ProductsAdmin onCatalogChanged={refreshCatalog} />
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-display">
                Administrator Access Required
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please sign in to manage the product catalog.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="bg-[#0E01B5] hover:bg-[#09007A] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Sign In
              </button>
            </div>
          )
        )}

        {activeTab === 'users' && (
          authUser ? (
            <UsersAdmin />
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-display">
                Sign In to Track Users
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Only signed-in administrators can view registered users and their purchasing activity.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="bg-[#0E01B5] hover:bg-[#09007A] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Sign In
              </button>
            </div>
          )
        )}
        */}

        {/* TODO: Admin-only pages
        {activeTab === 'matrix' && (
          <MatrixOrderPad products={products} onAddBulkToCart={handleAddBulkToCart} b2bProfile={activeProfile} />
        )}
        {activeTab === 'portal' && (
          <B2BPortalSection ... />
        )}
        */}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={handleSetTab} />

      {/* Product Detail Modal — adds to cart for in-app checkout */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdateOrderType={handleUpdateOrderType}
        onClearCart={handleClearCart}
        onProceedCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        poNumber={poNumber}
        setPoNumber={setPoNumber}
        orderNotes={orderNotes}
        setOrderNotes={setOrderNotes}
        onGenerateQuotation={() => setShowProFormaQuote(true)}
        allDepots={DEPOTS}
        cartDepot={cartDepot}
        onSelectDepot={setCartDepot}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        b2bProfile={activeProfile}
        activeDepot={cartDepot}
        poNumber={poNumber}
        orderNotes={orderNotes}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}
