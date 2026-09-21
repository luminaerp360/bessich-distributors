import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { MatrixOrderPad } from './components/MatrixOrderPad';
import { B2BPortalSection } from './components/B2BPortalSection';
import { DepotsSection } from './components/DepotsSection';
import { PriceListSection } from './components/PriceListSection';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CreditApplicationModal } from './components/CreditApplicationModal';
import { InvoiceViewerModal } from './components/InvoiceViewerModal';
import { AgeGateModal } from './components/AgeGateModal';
import { Footer } from './components/Footer';

import { PRODUCTS } from './data/products';
import { DEPOTS } from './data/depots';
import { Product, CartItem, Depot, B2BProfile, B2BOrder, ActivePage, ProductCategory, CatalogSyncStatus } from './types';
import { fetchLiveCatalog, getStoredCatalog } from './services/catalogSync';
import { CheckCircle2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

// Pre-configured commercial accounts for testing different tiers
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

// Initial seeded B2B orders to demonstrate order history, tracking & invoices
const INITIAL_ORDERS: B2BOrder[] = [
  {
    id: 'BD-2026-98124',
    orderDate: '14 Sep 2026',
    poNumber: 'PO-LOFT-2026-081',
    items: [
      { product: PRODUCTS[0], orderType: 'case', quantity: 5 },
      { product: PRODUCTS[2], orderType: 'case', quantity: 3 },
      { product: PRODUCTS[8], orderType: 'case', quantity: 4 },
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
      { product: PRODUCTS[1], orderType: 'case', quantity: 4 },
      { product: PRODUCTS[5], orderType: 'case', quantity: 2 },
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

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActivePage>('home');
  
  // Real-time catalog sync state (Option 1: Live Scraping & Auto-Polling)
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = getStoredCatalog();
    return cached.products.length > 0 ? cached.products : PRODUCTS;
  });

  const [syncStatus, setSyncStatus] = useState<CatalogSyncStatus>(() => {
    const cached = getStoredCatalog();
    return cached.status;
  });

  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Background live catalog sync on mount and auto-refresh every 3 minutes
  useEffect(() => {
    let isMounted = true;

    const performSync = async (force: boolean, isUserInitiated: boolean) => {
      if (isUserInitiated) {
        setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
      }
      try {
        const result = await fetchLiveCatalog(force);
        if (!isMounted) return;

        setSyncStatus(result.status);
        if (result.products.length > 0) {
          setProducts(result.products);
          if (isUserInitiated) {
            setSyncToast({
              message: `Synchronized ${result.products.length} live SKUs from Cyden General Enterprises / The Bar Kenya`,
              type: 'success',
            });
            setTimeout(() => setSyncToast(null), 4000);
          }
        } else if (result.status.error && isUserInitiated) {
          setSyncToast({
            message: `Sync notice: ${result.status.error}. Utilizing local catalog cache.`,
            type: 'info',
          });
          setTimeout(() => setSyncToast(null), 4500);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          error: err.message || 'Catalog synchronization error',
        }));
      }
    };

    // Initial silent sync check
    performSync(false, false);

    // Periodic background refresh every 3 minutes
    const interval = setInterval(() => {
      performSync(false, false);
    }, 180000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
    try {
      const result = await fetchLiveCatalog(true);
      setSyncStatus(result.status);
      if (result.products.length > 0) {
        setProducts(result.products);
        setSyncToast({
          message: `Successfully synchronized ${result.products.length} live SKUs from Cyden General Enterprises / The Bar Kenya`,
          type: 'success',
        });
      } else {
        setSyncToast({
          message: result.status.error || 'Live synchronization finished with cached catalog baseline.',
          type: 'info',
        });
      }
    } catch (err: any) {
      setSyncToast({
        message: `Sync failed: ${err.message}`,
        type: 'error',
      });
    }
    setTimeout(() => setSyncToast(null), 4500);
  };
  
  // Catalog search state
  const [searchQuery, setSearchQuery] = useState('');

  // Depots state
  const [activeDepot, setActiveDepot] = useState<Depot>(DEPOTS[0]);

  const handleNavigate = (page: ActivePage, _category?: ProductCategory) => {
    setActiveTab(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profiles & Auth simulation
  const [availableProfiles, setAvailableProfiles] = useState<B2BProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<B2BProfile>(INITIAL_PROFILES[0]);

  // Orders state
  const [orders, setOrders] = useState<B2BOrder[]>(INITIAL_ORDERS);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Seed with initial high-velocity commercial order
    { product: PRODUCTS[0], orderType: 'case', quantity: 2 },
    { product: PRODUCTS[2], orderType: 'case', quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [poNumber, setPoNumber] = useState('PO-LOFT-2026-089');
  const [orderNotes, setOrderNotes] = useState('Offload at Service Entrance B, check with Brian');

  // Modals state
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<B2BOrder | null>(null);
  const [showProFormaQuote, setShowProFormaQuote] = useState(false);

  // Dark / Light mode state with persistence & system preference fallback
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

  // Cart operations
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
    setIsCartOpen(true);
  };

  const handleAddBulkToCart = (newItems: CartItem[]) => {
    setCartItems((prev) => {
      const updated = [...prev];
      for (const newItem of newItems) {
        const idx = updated.findIndex(
          (item) => item.product.id === newItem.product.id && item.orderType === newItem.orderType
        );
        if (idx > -1) {
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + newItem.quantity,
          };
        } else {
          updated.push(newItem);
        }
      }
      return updated;
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Reorder past order
  const handleReorder = (order: B2BOrder) => {
    handleAddBulkToCart(order.items);
    setIsCartOpen(true);
  };

  // Order success handler
  const handleOrderSuccess = (newOrder: B2BOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct available credit if ordered on credit
    if (newOrder.paymentMethod === 'credit') {
      setActiveProfile((prev) => ({
        ...prev,
        availableCreditKes: Math.max(0, prev.availableCreditKes - newOrder.totalKes),
      }));
    }
    setCartItems([]);
  };

  // Credit approval callback
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

      {/* Header Bar with Top Right Theme Switcher & Live Sync Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        activeDepot={activeDepot}
        allDepots={DEPOTS}
        onSelectDepot={setActiveDepot}
        b2bProfile={activeProfile}
        availableProfiles={availableProfiles}
        onSwitchProfile={setActiveProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenApplyCredit={() => setIsCreditModalOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        syncStatus={syncStatus}
        onManualSync={handleManualSync}
      />

      {/* Main Content Area based on activeTab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            products={products}
            b2bProfile={activeProfile}
            onAddToCart={handleAddToCart}
            onOpenDetails={setSelectedProductDetail}
            onNavigate={handleNavigate}
            onOpenCreditModal={() => setIsCreditModalOpen(true)}
            onOpenMatrix={() => setActiveTab('matrix')}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection
            onNavigate={handleNavigate}
            onOpenCreditModal={() => setIsCreditModalOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogSection
            products={products}
            onAddToCart={handleAddToCart}
            onOpenDetails={setSelectedProductDetail}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            syncStatus={syncStatus}
            onManualSync={handleManualSync}
          />
        )}

        {(activeTab === 'branches' || activeTab === 'depots') && (
          <DepotsSection
            depots={DEPOTS}
            activeDepot={activeDepot}
            onSelectDepot={(depot) => {
              setActiveDepot(depot);
            }}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection
            onOpenCreditModal={() => setIsCreditModalOpen(true)}
          />
        )}

        {activeTab === 'matrix' && (
          <MatrixOrderPad
            products={products}
            onAddBulkToCart={handleAddBulkToCart}
            b2bProfile={activeProfile}
          />
        )}

        {activeTab === 'portal' && (
          <B2BPortalSection
            b2bProfile={activeProfile}
            availableProfiles={availableProfiles}
            onSwitchProfile={setActiveProfile}
            orders={orders}
            products={products}
            onOpenCreditModal={() => setIsCreditModalOpen(true)}
            onReorder={handleReorder}
            onViewInvoice={(order) => setActiveInvoiceOrder(order)}
            onNavigateToPricelist={() => setActiveTab('pricelist')}
            syncStatus={syncStatus}
            onManualSync={handleManualSync}
          />
        )}

        {activeTab === 'pricelist' && (
          <PriceListSection
            products={products}
            onQuickOrderProduct={(product) => {
              handleAddToCart(product, 'case', 1);
            }}
          />
        )}
      </main>

      {/* Live Catalog Sync Floating Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
            syncToast.type === 'success'
              ? 'bg-[#171728]/95 text-white border-emerald-500/50'
              : syncToast.type === 'error'
              ? 'bg-rose-950/95 text-rose-100 border-rose-500/50'
              : 'bg-[#171728]/95 text-white border-blue-500/50'
          }`}>
            {syncToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : syncToast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{syncToast.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} />

      {/* Product Detail Modal */}
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
        onClearCart={handleClearCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        poNumber={poNumber}
        setPoNumber={setPoNumber}
        orderNotes={orderNotes}
        setOrderNotes={setOrderNotes}
        onGenerateQuotation={() => {
          setIsCartOpen(false);
          setShowProFormaQuote(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        b2bProfile={activeProfile}
        activeDepot={activeDepot}
        poNumber={poNumber}
        orderNotes={orderNotes}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Trade Credit Application Modal */}
      <CreditApplicationModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        b2bProfile={activeProfile}
        onSubmitSuccess={handleCreditApproved}
      />

      {/* Invoice & Pro-Forma Viewer Modal */}
      <InvoiceViewerModal
        order={activeInvoiceOrder}
        proFormaItems={showProFormaQuote ? cartItems : undefined}
        b2bProfile={activeProfile}
        onClose={() => {
          setActiveInvoiceOrder(null);
          setShowProFormaQuote(false);
        }}
      />
    </div>
  );
}
