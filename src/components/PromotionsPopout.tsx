import React, { useEffect, useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  Wine, 
  Search,
  Flame,
  Tag
} from 'lucide-react';
import { Product } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

interface PromotionsPopoutProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenDetails?: (product: Product) => void;
  onAddToCart?: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
  onNavigateToCatalog?: () => void;
}

export const PromotionsPopout: React.FC<PromotionsPopoutProps> = ({
  isOpen,
  onClose,
  products,
  onOpenDetails,
  onAddToCart,
  onNavigateToCatalog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Extract products with active offers (or compare-at discounts)
  const promoProducts = useMemo(() => {
    const active = products.filter((p) => p.isPromoActive);
    if (active.length > 0) return active;
    // Fallback if no promo is marked active
    return products.filter((p) => Boolean(p.compareAtPriceKes && p.compareAtPriceKes > p.casePriceKes));
  }, [products]);

  // Category counts among promotional products
  const categoryTabs = useMemo(() => {
    const counts = new Map<string, number>();
    promoProducts.forEach((p) => {
      const cat = p.category || 'other';
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });

    const tabs: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Offers', count: promoProducts.length },
    ];

    counts.forEach((count, cat) => {
      const formatted = cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      tabs.push({ id: cat, label: formatted, count });
    });

    return tabs;
  }, [promoProducts]);

  // Filtered by category and search
  const visibleProducts = useMemo(() => {
    return promoProducts.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = (p.brand || '').toLowerCase().includes(q);
        const matchesSub = (p.subcategory || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSub) return false;
      }
      return true;
    });
  }, [promoProducts, selectedCategory, searchQuery]);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(p, 'bottle', 1);
      setJustAddedId(p.id);
      setTimeout(() => {
        setJustAddedId((prev) => (prev === p.id ? null : prev));
      }, 1400);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#151525] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Radiant Promotional Header */}
        <div className="relative bg-gradient-to-r from-[#0E01B5] via-[#7c3aed] to-[#F2693F] text-white p-5 sm:p-6 shrink-0 shadow-md">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close offers"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              <Flame className="w-3 h-3 text-[#FFD700]" />
              Live Product Offers &amp; Discounts
            </span>
            <span className="bg-[#FFD700] text-[#171728] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
              {promoProducts.length} On Sale
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold font-display mt-2 leading-tight">
            Special Offers at Bessich
          </h3>
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl leading-relaxed">
            Limited-time promotional discounts on selected premium bottles &amp; cases — synced live from our store.
          </p>

          {/* Quick Search */}
          <div className="mt-3.5 relative max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search offer items by brand or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/15 hover:bg-white/20 focus:bg-white text-white focus:text-gray-900 placeholder-white/70 focus:placeholder-gray-400 pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-white/30 focus:border-white outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        {categoryTabs.length > 2 && (
          <div className="flex items-center gap-1.5 px-5 sm:px-6 pt-3.5 pb-1 overflow-x-auto no-scrollbar shrink-0 border-b border-gray-100 dark:border-white/5">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-[#0E01B5] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#1f1f33] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#282844]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Product Offers Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {visibleProducts.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                No matching promotional products found
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No offers matched "${searchQuery}". Try a different keyword.`
                  : 'Check back soon for new special promotional offers and seasonal discounts.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#0E01B5] dark:text-[#8c82ff] font-bold underline cursor-pointer"
                >
                  Reset search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {visibleProducts.map((p) => {
                const bottlePrice = p.bottlePriceKes;
                const rawCompare =
                  p.compareAtBottlePriceKes ||
                  (p.compareAtPriceKes ? Math.round(p.compareAtPriceKes / p.casePack) : undefined);
                const compareAt =
                  rawCompare && rawCompare > bottlePrice
                    ? rawCompare
                    : Math.round(bottlePrice / (1 - (p.savingsPercentage || 15) / 100));
                const savings =
                  p.savingsAmountBottleKes && p.savingsAmountBottleKes > 0
                    ? p.savingsAmountBottleKes
                    : compareAt > bottlePrice
                    ? compareAt - bottlePrice
                    : 0;
                const isJustAdded = justAddedId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => onOpenDetails && onOpenDetails(p)}
                    className="group relative bg-white dark:bg-[#1c1c30] rounded-2xl border border-gray-200 dark:border-white/10 hover:border-rose-400 dark:hover:border-rose-500/80 p-3.5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                        <Flame className="w-2.5 h-2.5" />
                        <span>{p.promoBadgeText || `-${p.savingsPercentage || 15}% OFF`}</span>
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {p.category.toUpperCase()} • {p.volumeMl}ml
                      </span>
                    </div>

                    {/* Content Row: Image + Title/Brand */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 bg-gray-50 dark:bg-[#12121e] rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 overflow-hidden">
                        <img
                          src={getProductImageUrl(p.image)}
                          alt={p.name}
                          onError={(e) => handleImageError(e, p.fallbackImage)}
                          loading="lazy"
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#3AA88C] uppercase tracking-wider truncate block">
                          {p.brand}
                        </span>
                        <h4
                          className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#0E01B5] dark:group-hover:text-[#8c82ff] transition-colors"
                          title={p.name}
                        >
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Case pack: {p.casePack} bottles
                        </span>
                      </div>
                    </div>

                    {/* Pricing Block & Add Button */}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-end justify-between gap-2 mt-auto">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tracking-tight whitespace-nowrap">
                            {formatKes(bottlePrice)}
                          </span>
                          {compareAt > bottlePrice && (
                            <span className="text-xs text-gray-400 line-through font-semibold whitespace-nowrap">
                              {formatKes(compareAt)}
                            </span>
                          )}
                        </div>

                        {savings > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-rose-200/80 dark:border-rose-900/60 inline-flex items-center gap-1">
                              <span>Save {formatKes(savings)}</span>
                              {p.savingsPercentage && <span>({p.savingsPercentage}% OFF)</span>}
                            </span>
                          </div>
                        )}

                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {formatKes(p.casePriceKes)} / case ({p.casePack} btls)
                        </span>
                      </div>

                      {/* Quick Add Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(p, e)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#3AA88C] hover:bg-[#2C856E] text-white'
                        }`}
                        title="Add 1 bottle to cart"
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#12121e] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Tag className="w-3.5 h-3.5 text-rose-500" />
            <span>
              Showing <strong className="text-gray-800 dark:text-gray-200">{visibleProducts.length}</strong> products with active promotional pricing
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToCatalog && (
              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0E01B5] to-[#7c3aed] text-white hover:opacity-95 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
