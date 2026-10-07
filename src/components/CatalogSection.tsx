import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Check, 
  Wine, 
  Sparkles,
  Flame,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';

interface CatalogSectionProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddToCart: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
  isWholesale?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  cartItems?: CartItem[];
  onUpdateCartQuantity?: (index: number, quantity: number) => void;
}

const CATEGORIES = [
  'All',
  'Whiskey',
  'Gin',
  'Vodka',
  'Rum',
  'Brandy & Cognac',
  'Liqueur',
  'Spirits',
  'Beer & Cider',
  'Wine',
  'Champagne',
  'Tequila',
  'Ready To Drink',
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  onOpenDetails,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  isWholesale = false,
  onOpenAuth,
  cartItems = [],
  onUpdateCartQuantity,
}) => {
  // Filter States matching Cyden Catalogue
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [offersOnly, setOffersOnly] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const resultsGridRef = useRef<HTMLDivElement>(null);

  // Extract unique available brands
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.trim()) {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, inStockOnly, offersOnly]);

  // Category matching helper
  const matchesCategory = (product: Product, cat: string) => {
    if (cat === 'All') return true;
    const name = product.name.toLowerCase();
    const sub = (product.subcategory || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const pCat = product.category;

    switch (cat) {
      case 'Whiskey':
        return pCat === 'whiskey' || name.includes('whisky') || name.includes('whiskey') || sub.includes('whiskey') || sub.includes('whisky');
      case 'Gin':
        return pCat === 'gin' || name.includes('gin') || sub.includes('gin');
      case 'Vodka':
        return pCat === 'vodka' || name.includes('vodka') || sub.includes('vodka');
      case 'Rum':
        return pCat === 'rum' || name.includes('rum') || sub.includes('rum');
      case 'Brandy & Cognac':
        return pCat === 'brandy' || name.includes('brandy') || name.includes('cognac') || sub.includes('brandy') || sub.includes('cognac');
      case 'Liqueur':
        return pCat === 'liqueur' || name.includes('liqueur') || sub.includes('liqueur');
      case 'Spirits':
        return pCat === 'spirits' || sub.includes('spirit');
      case 'Beer & Cider':
        return pCat === 'beer_cider' || name.includes('beer') || name.includes('cider') || name.includes('stout') || sub.includes('beer') || sub.includes('cider');
      case 'Wine':
        return pCat === 'wine' || name.includes('wine') || sub.includes('wine');
      case 'Champagne':
        return pCat === 'champagne' || name.includes('champagne') || name.includes('sparkling') || sub.includes('champagne');
      case 'Tequila':
        return name.includes('tequila') || sub.includes('tequila') || brand.includes('don julio') || brand.includes('patron');
      case 'Ready To Drink':
        return name.includes('rtd') || name.includes('ready to drink') || name.includes('smirnoff ice') || name.includes('snapp') || name.includes('guinness smooth') || sub.includes('rtd');
      default:
        return true;
    }
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Keyword Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesBrand = product.brand.toLowerCase().includes(q);
          const matchesSku = product.sku.toLowerCase().includes(q);
          const matchesSub = (product.subcategory || '').toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesSku && !matchesSub) {
            return false;
          }
        }

        // Category filter
        if (!matchesCategory(product, selectedCategory)) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'All' && product.brand !== selectedBrand) {
          return false;
        }

        // In Stock Only toggle
        if (inStockOnly && !product.inStock) {
          return false;
        }

        // Offers Only toggle (Active promotions / discounts)
        if (offersOnly && !product.isPromoActive) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.casePriceKes - b.casePriceKes;
        if (sortBy === 'price-desc') return b.casePriceKes - a.casePriceKes;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        // Default: featured first, then active promos first
        if (a.isPromoActive !== b.isPromoActive) {
          return a.isPromoActive ? -1 : 1;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedBrand, inStockOnly, offersOnly, sortBy]);

  // Paginated product slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchQuery('');
    setInStockOnly(false);
    setOffersOnly(false);
    setSortBy('featured');
  };

  const isFilterActive =
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    searchQuery.trim() !== '' ||
    inStockOnly ||
    offersOnly ||
    sortBy !== 'featured';

  // Smooth scroll page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (resultsGridRef.current) {
      const targetY = resultsGridRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    if (resultsGridRef.current) {
      const targetY = resultsGridRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-16 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 1. FILTER & SEARCH CONTROL BAR (CYDEN STYLE) */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-[#171728] rounded-2xl p-4 sm:p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4"
        >
          {/* Top Row: Search Input & Dropdowns & Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Tusker, Blue Label, Gin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#F8F7F4] dark:bg-[#1b1b2d] border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-[#222222] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#3AA88C] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs cursor-pointer p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Brand Dropdown, Sort Dropdown & Toggles */}
            <div className="w-full sm:w-auto flex flex-wrap items-center gap-2.5">
              {/* Brand Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold hidden md:inline">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-3 py-2 bg-[#F8F7F4] dark:bg-[#1b1b2d] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-medium text-[#222222] dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#3AA88C] cursor-pointer"
                >
                  <option value="All">All Brands</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500 dark:text-neutral-400 font-semibold hidden md:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-[#F8F7F4] dark:bg-[#1b1b2d] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-medium text-[#222222] dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#3AA88C] cursor-pointer"
                >
                  <option value="featured">Featured / Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* In-Stock Only Toggle */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  inStockOnly
                    ? 'bg-[#3AA88C] text-white border-[#3AA88C]'
                    : 'bg-[#F8F7F4] dark:bg-[#1b1b2d] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-[#25253d]'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${inStockOnly ? 'opacity-100' : 'opacity-0'}`} />
                <span>In Stock Only</span>
              </motion.button>

              {/* 🔥 Offers / Promotions Quick Toggle */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setOffersOnly(!offersOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                  offersOnly
                    ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white border-transparent shadow-sm'
                    : 'bg-[#F8F7F4] dark:bg-[#1b1b2d] text-rose-600 dark:text-rose-400 border-neutral-200 dark:border-neutral-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                }`}
                title="Filter products on promotional offer"
              >
                <span>🔥</span>
                <span>Offers Only</span>
              </motion.button>

              {/* Reset Button */}
              {isFilterActive && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 text-xs text-[#E8582F] hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Pills Strip */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex-shrink-0 mr-1">
              CATEGORY:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3E6F] text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-[#1f1f33] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#282844]'
                  }`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Anchor Ref for smooth scroll */}
      <div ref={resultsGridRef} className="scroll-mt-28" />

      {/* Wholesale Account Prompt Banner */}
      {!isWholesale && onOpenAuth && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-[#F5F5DC]/40 dark:bg-[#1b1b2d] border border-[#F5F5DC] dark:border-neutral-700 text-xs">
          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Viewing <b>normal retail & case prices</b>. Registered hospitality & retail venues unlock{' '}
              <b>trade tier discounts</b>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="shrink-0 bg-[#1B3E6F] hover:bg-[#142e53] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            Unlock Trade Rates
          </button>
        </div>
      )}

      {/* 2. RESULTS COUNTER & SUMMARY ROW */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Showing <strong className="text-neutral-900 dark:text-white font-bold">{filteredProducts.length}</strong> items in catalogue
            {selectedCategory !== 'All' && ` (${selectedCategory})`}
            {offersOnly && ' • Active Offers Only'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 hidden sm:inline">Pricing currency: KSH</span>
          </div>
        </div>

        {/* 3. PRODUCT RESULTS GRID (4 COLUMNS CYDEN STYLE) */}
        {filteredProducts.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${selectedBrand}-${currentPage}-${offersOnly}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                id="catalog-products-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {paginatedProducts.map((product, idx) => {
                  const cartItemIndex = cartItems.findIndex(
                    (item) => item.product.id === product.id
                  );
                  const cartQty = cartItemIndex >= 0 ? cartItems[cartItemIndex].quantity : 0;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={onOpenDetails}
                      onAddToCart={onAddToCart}
                      cartQuantity={cartQty}
                      cartIndex={cartItemIndex}
                      onUpdateCartQuantity={onUpdateCartQuantity}
                      index={idx}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[12, 24, 48, 96]}
              itemLabel="items"
              idPrefix="catalog-bottom"
              className="mt-8"
            />
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-[#171728] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 space-y-3">
            <Wine className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              No beverages found matching your criteria
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or resetting category to view the full inventory.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-[#3AA88C] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#2F8D75] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
