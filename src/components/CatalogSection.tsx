import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Wine, 
  Flame, 
  GlassWater, 
  Beer, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  X,
  Layers,
  Globe
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
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
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  onOpenDetails,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  isWholesale = false,
  onOpenAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'abv'>('featured');
  const [onlyKRA, setOnlyKRA] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const resultsGridRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever any search or filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedOrigin, onlyKRA, sortBy]);

  // Extract unique origins
  const origins = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.origin.split(',')[p.origin.split(',').length - 1].trim())));
    return ['all', ...list];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesCategory = product.subcategory.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesCategory) {
          return false;
        }
      }

      // Category check
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Origin check
      if (selectedOrigin !== 'all') {
        if (!product.origin.toLowerCase().includes(selectedOrigin.toLowerCase())) {
          return false;
        }
      }

      // KRA check
      if (onlyKRA && !product.kraStampVerified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.casePriceKes - b.casePriceKes;
      if (sortBy === 'price-desc') return b.casePriceKes - a.casePriceKes;
      if (sortBy === 'abv') return b.abv - a.abv;
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, selectedOrigin, onlyKRA, sortBy]);

  // Paginated product slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Handle page navigation with smooth scroll
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (resultsGridRef.current) {
      const targetY = resultsGridRef.current.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    if (resultsGridRef.current) {
      const targetY = resultsGridRef.current.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all' as ProductCategory, label: 'All Beverages', icon: Layers },
    { id: 'whiskey' as ProductCategory, label: 'Whiskies', icon: Flame },
    { id: 'gin' as ProductCategory, label: 'Gins', icon: Sparkles },
    { id: 'vodka' as ProductCategory, label: 'Vodkas', icon: GlassWater },
    { id: 'wine' as ProductCategory, label: 'Fine Wines', icon: Wine },
    { id: 'beer_cider' as ProductCategory, label: 'Beers & Ciders', icon: Beer },
    { id: 'rum' as ProductCategory, label: 'Rums', icon: Flame },
    { id: 'brandy' as ProductCategory, label: 'Brandy & Cognac', icon: Sparkles },
    { id: 'champagne' as ProductCategory, label: 'Champagne', icon: Sparkles },
    { id: 'liqueur' as ProductCategory, label: 'Liqueurs', icon: Sparkles },
    { id: 'spirits' as ProductCategory, label: 'Spirits', icon: GlassWater },
  ];

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3.5">
        <div>
          <div className="text-[11px] sm:text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider mb-0.5">
            Direct Importer & Wholesale Supply
          </div>
          <h2 className="hero-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171728] dark:text-white font-display">
            Online Beverage Catalog
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
            Browse our authenticated inventory of wines, spirits, and beers with tiered case wholesale rates and real-time depot availability.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25253d] cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
            <span>Filters</span>
            {(selectedOrigin !== 'all' || onlyKRA) && (
              <span className="w-2 h-2 rounded-full bg-[#0E01B5] dark:bg-[#8c82ff]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#1b1b2d] border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-[#0E01B5] dark:focus:ring-[#8c82ff] focus:outline-hidden"
            >
              <option value="featured">Featured / Top Velocity</option>
              <option value="price-asc">Wholesale Case: Low to High</option>
              <option value="price-desc">Wholesale Case: High to Low</option>
              <option value="abv">Alcohol Volume (ABV %)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Tier Banner */}
      {!isWholesale && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-xl bg-[#F5F5DC]/40 dark:bg-[#23233a] border border-[#F5F5DC] dark:border-gray-700 text-xs">
          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              You are viewing <b>normal retail pricing</b>. Registered wholesale customers automatically receive{' '}
              <b>lower wholesale trade prices</b> — create an account or sign in to unlock them.
            </p>
          </div>
          {onOpenAuth && (
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="shrink-0 bg-[#0E01B5] hover:bg-[#09007A] text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Unlock Wholesale Prices
            </button>
          )}
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0E01B5] text-white shadow-md'
                  : 'bg-white dark:bg-[#1b1b2d] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#0E01B5]/30 hover:bg-gray-50 dark:hover:bg-[#25253d]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD700]' : 'text-gray-500 dark:text-gray-400'}`} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-[#171728] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
              Refine Wholesale Selection
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedOrigin('all');
                setOnlyKRA(false);
              }}
              className="text-[11px] text-[#0E01B5] dark:text-[#8c82ff] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Country of Origin */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                Country / Region of Origin:
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full bg-[#FAF9F6] dark:bg-[#12121e] border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-800 dark:text-gray-200"
              >
                <option value="all">All Origins</option>
                {origins.filter(o => o !== 'all').map((orig) => (
                  <option key={orig} value={orig}>{orig}</option>
                ))}
              </select>
            </div>

            {/* KRA Stamp toggle */}
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyKRA}
                  onChange={(e) => setOnlyKRA(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-[#0E01B5] focus:ring-[#0E01B5]"
                />
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">
                  Only KRA Stamp Verified Stock
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Search & Filters Pill Bar */}
      {(searchQuery || selectedCategory !== 'all' || selectedOrigin !== 'all' || onlyKRA) && (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-[#F5F5DC]/40 dark:bg-[#1b1b2d] p-2.5 rounded-lg border border-[#F5F5DC] dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">Active filters:</span>
          {searchQuery && (
            <span className="bg-white dark:bg-[#25253d] px-2 py-0.5 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
              Keyword: "{searchQuery}"
              <button type="button" onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3 text-gray-400 hover:text-gray-700 dark:hover:text-white" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="bg-white dark:bg-[#25253d] px-2 py-0.5 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
              Category: {selectedCategory}
              <button type="button" onClick={() => setSelectedCategory('all')}>
                <X className="w-3 h-3 text-gray-400 hover:text-gray-700 dark:hover:text-white" />
              </button>
            </span>
          )}
          {selectedOrigin !== 'all' && (
            <span className="bg-white dark:bg-[#25253d] px-2 py-0.5 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
              Origin: {selectedOrigin}
              <button type="button" onClick={() => setSelectedOrigin('all')}>
                <X className="w-3 h-3 text-gray-400 hover:text-gray-700 dark:hover:text-white" />
              </button>
            </span>
          )}
          {onlyKRA && (
            <span className="bg-white dark:bg-[#25253d] px-2 py-0.5 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
              KRA Verified Only
              <button type="button" onClick={() => setOnlyKRA(false)}>
                <X className="w-3 h-3 text-gray-400 hover:text-gray-700 dark:hover:text-white" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedOrigin('all');
              setOnlyKRA(false);
            }}
            className="text-[11px] text-[#0E01B5] dark:text-[#8c82ff] font-bold hover:underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Anchor Ref for smooth scroll */}
      <div ref={resultsGridRef} className="scroll-mt-28" />

      {/* Top Pagination Summary & Quick Nav when products are available */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300 pb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredProducts.length)}
            </span>
            <span>of</span>
            <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span>
            <span>products</span>
            {Math.ceil(filteredProducts.length / pageSize) > 1 && (
              <span className="bg-gray-100 dark:bg-[#232338] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-gray-200 dark:border-gray-700">
                Page {currentPage} of {Math.ceil(filteredProducts.length / pageSize)}
              </span>
            )}
          </div>

          {filteredProducts.length > pageSize && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="catalog-top-prev-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] font-semibold text-[11px] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#25253d] transition-colors"
              >
                ← Prev
              </button>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                {currentPage} / {Math.ceil(filteredProducts.length / pageSize)}
              </span>
              <button
                type="button"
                id="catalog-top-next-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(filteredProducts.length / pageSize)}
                className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] font-semibold text-[11px] text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#25253d] transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Results Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div id="catalog-products-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Bottom Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[12, 24, 48, 96]}
            itemLabel="products"
            idPrefix="catalog-bottom"
            className="mt-6"
          />
        </>
      ) : (
        <div className="text-center py-10 sm:py-14 bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-8 space-y-3">
          <Wine className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">No beverages found matching your criteria</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Try adjusting your search keywords, origin selection, or category filter to view our available stock.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedOrigin('all');
              setOnlyKRA(false);
            }}
            className="bg-[#0E01B5] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#09007A] transition-colors cursor-pointer"
          >
            View Entire Inventory
          </button>
        </div>
      )}
    </section>
  );
};
