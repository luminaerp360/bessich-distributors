import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CatalogSection } from './components/CatalogSection';
// import { MatrixOrderPad } from './components/MatrixOrderPad';          // TODO: Admin-only
// import { B2BPortalSection } from './components/B2BPortalSection';      // TODO: Admin-only
import { DepotsSection } from './components/DepotsSection';
import { PriceListSection } from './components/PriceListSection';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
// import { CreditApplicationModal } from './components/CreditApplicationModal'; // TODO: Admin-only
// import { InvoiceViewerModal } from './components/InvoiceViewerModal';   // TODO: Admin-only
import { AgeGateModal } from './components/AgeGateModal';
import { Footer } from './components/Footer';

import { PRODUCTS } from './data/products';
import { DEPOTS } from './data/depots';
import { Product, Depot, ActivePage, ProductCategory } from './types';
import { fetchLiveCatalog, getStoredCatalog } from './services/catalogSync';

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
  
  // Real-time catalog sync state — auto-synced silently in background
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = getStoredCatalog();
    return cached.products.length > 0 ? cached.products : PRODUCTS;
  });

  // Background live catalog sync on mount and auto-refresh every 3 minutes
  useEffect(() => {
    let isMounted = true;

    const performSync = async () => {
      try {
        const result = await fetchLiveCatalog(false);
        if (!isMounted) return;

        if (result.products.length > 0) {
          setProducts(result.products);
        }
      } catch {
        // Silent — fallback to baseline products
      }
    };

    performSync();
    const interval = setInterval(performSync, 180000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const [orders, setOrders] = useState<B2BOrder[]>(INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDepot={activeDepot}
        allDepots={DEPOTS}
        onSelectDepot={setActiveDepot}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            products={products}
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
            products={products}
            onOpenDetails={setSelectedProductDetail}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
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
          <ContactSection />
        )}

        {activeTab === 'pricelist' && (
          <PriceListSection products={products} />
        )}

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
      <Footer onNavigateTab={setActiveTab} />

      {/* Product Detail Modal — redirects to The Bar Kenya for orders */}
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
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
