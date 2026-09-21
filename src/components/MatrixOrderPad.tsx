import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Search, 
  Check, 
  Trash2, 
  Download,
  Percent
} from 'lucide-react';
import { Product, CartItem, B2BProfile } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';
import { Pagination } from './Pagination';

interface MatrixOrderPadProps {
  products: Product[];
  onAddBulkToCart: (items: CartItem[]) => void;
  b2bProfile: B2BProfile;
}

export const MatrixOrderPad: React.FC<MatrixOrderPadProps> = ({
  products,
  onAddBulkToCart,
  b2bProfile,
}) => {
  // State mapping of product id to case quantity and bottle quantity
  const [quantities, setQuantities] = useState<Record<string, { cases: number; bottles: number }>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Filter products for the pad
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, searchTerm]);

  // Paginated slice for display
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (tableRef.current) {
      const top = tableRef.current.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  const handleCaseChange = (productId: string, val: number) => {
    const safeVal = Math.max(0, val);
    setQuantities((prev) => ({
      ...prev,
      [productId]: {
        cases: safeVal,
        bottles: prev[productId]?.bottles || 0,
      },
    }));
  };

  const handleBottleChange = (productId: string, val: number) => {
    const safeVal = Math.max(0, val);
    setQuantities((prev) => ({
      ...prev,
      [productId]: {
        cases: prev[productId]?.cases || 0,
        bottles: safeVal,
      },
    }));
  };

  const handleClearAll = () => {
    setQuantities({});
  };

  // Calculate order totals in the pad
  let totalCases = 0;
  let totalBottles = 0;
  let totalGross = 0;
  let totalDiscount = 0;

  const orderLines: CartItem[] = [];

  for (const [productId, q] of Object.entries(quantities)) {
    const product = products.find((p) => p.id === productId);
    if (!product) continue;

    if (q.cases > 0) {
      orderLines.push({
        product,
        orderType: 'case',
        quantity: q.cases,
      });
      totalCases += q.cases;
      const lineGross = q.cases * product.casePriceKes;
      totalGross += lineGross;

      // Tier discount calculation
      let maxDiscount = 0;
      for (const t of product.tiers) {
        if (q.cases >= t.minCases && t.discountPercentage > maxDiscount) {
          maxDiscount = t.discountPercentage;
        }
      }
      totalDiscount += Math.round((lineGross * maxDiscount) / 100);
    }

    if (q.bottles > 0) {
      orderLines.push({
        product,
        orderType: 'bottle',
        quantity: q.bottles,
      });
      totalBottles += q.bottles;
      totalGross += q.bottles * product.bottlePriceKes;
    }
  }

  const netTotal = totalGross - totalDiscount;

  const handleAddAllToCart = () => {
    if (orderLines.length === 0) return;
    onAddBulkToCart(orderLines);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setQuantities({});
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* Header Info */}
      <div className="bg-[#171728] text-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-1">
              <Percent className="w-3.5 h-3.5" /> High-Velocity Commercial Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display">
              B2B Quick Order Pad
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F5DC]/80 mt-1 max-w-2xl">
              Rapid multi-line ordering system for venue managers and retailers. Enter your case or bottle quantities directly into the grid and submit your entire stock order with one click.
            </p>
          </div>

          {/* Active Profile Pill */}
          <div className="bg-[#23233a] border border-white/10 p-3 rounded-xl text-xs space-y-0.5 shrink-0">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">
              Ordering Account:
            </span>
            <span className="font-bold text-white block truncate max-w-[200px]">
              {b2bProfile.businessName}
            </span>
            <span className="text-emerald-400 font-medium block text-[11px]">
              {b2bProfile.isVerified ? `Terms: Net ${b2bProfile.paymentTermsDays} Days` : 'Cash on Delivery'}
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, brand, SKU..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#23233a] text-xs text-white border border-white/15 focus:outline-hidden focus:border-[#FFD700]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            {['all', 'whiskey', 'gin', 'vodka', 'wine', 'beer_cider', 'rum', 'brandy', 'champagne', 'liqueur'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors capitalize cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#0E01B5] text-white shadow-xs'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat === 'all' ? 'All Brands' : cat === 'beer_cider' ? 'Beers & Ciders' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll anchor */}
      <div ref={tableRef} className="scroll-mt-24" />

      {/* Matrix Table */}
      <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] dark:bg-[#12121e] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 sm:px-4">Item & Specification</th>
                <th className="py-2.5 px-3">Pack Spec</th>
                <th className="py-2.5 px-3">Wholesale Case Rate</th>
                <th className="py-2.5 px-3">Bottle Rate</th>
                <th className="py-2.5 px-3 text-center">Cases to Order</th>
                <th className="py-2.5 px-3 text-center">Loose Bottles</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Line Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedProducts.map((p) => {
                const q = quantities[p.id] || { cases: 0, bottles: 0 };
                const caseGross = q.cases * p.casePriceKes;
                let caseDiscPct = 0;
                for (const t of p.tiers) {
                  if (q.cases >= t.minCases && t.discountPercentage > caseDiscPct) {
                    caseDiscPct = t.discountPercentage;
                  }
                }
                const caseNet = caseGross * (1 - caseDiscPct / 100);
                const bottleGross = q.bottles * p.bottlePriceKes;
                const lineTotal = Math.round(caseNet + bottleGross);

                return (
                  <tr 
                    key={p.id}
                    className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${
                      q.cases > 0 || q.bottles > 0 ? 'bg-[#0E01B5]/5 dark:bg-[#0E01B5]/15 font-medium' : ''
                    }`}
                  >
                    {/* Item details */}
                    <td className="py-2.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={getProductImageUrl(p.image)} 
                          alt={p.name} 
                          className="w-9 h-9 object-contain bg-gray-50 dark:bg-[#25253d] p-1 rounded border border-gray-200 dark:border-gray-700 shrink-0" 
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, p.fallbackImage)}
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <span className="font-mono">{p.sku}</span>
                            <span>•</span>
                            <span className="text-[#0E01B5] dark:text-[#8c82ff] font-semibold uppercase">{p.brand}</span>
                            <span>•</span>
                            <span>{p.originFlag} {p.abv}% ABV</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pack Spec */}
                    <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {p.casePack} × {p.volumeMl}ml
                    </td>

                    {/* Wholesale Case */}
                    <td className="py-2.5 px-3 text-gray-900 dark:text-white whitespace-nowrap">
                      <div className="font-bold">{formatKes(p.casePriceKes)}</div>
                      <div className="text-[10px] text-gray-400">
                        {formatKes(Math.round(p.casePriceKes / p.casePack))}/btl
                      </div>
                    </td>

                    {/* Single Bottle */}
                    <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">
                      {formatKes(p.bottlePriceKes)}
                    </td>

                    {/* Cases Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1b1b2d] shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleCaseChange(p.id, q.cases - 1)}
                          className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d] font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={q.cases === 0 ? '' : q.cases}
                          placeholder="0"
                          onChange={(e) => handleCaseChange(p.id, parseInt(e.target.value) || 0)}
                          className="w-12 text-center font-bold text-xs py-1 text-gray-900 dark:text-white bg-transparent focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleCaseChange(p.id, q.cases + 1)}
                          className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d] font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {caseDiscPct > 0 && (
                        <span className="block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                          -{caseDiscPct}% bulk rate
                        </span>
                      )}
                    </td>

                    {/* Bottles Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1b1b2d] shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleBottleChange(p.id, q.bottles - 1)}
                          className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d] font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={q.bottles === 0 ? '' : q.bottles}
                          placeholder="0"
                          onChange={(e) => handleBottleChange(p.id, parseInt(e.target.value) || 0)}
                          className="w-12 text-center font-bold text-xs py-1 text-gray-900 dark:text-white bg-transparent focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleBottleChange(p.id, q.bottles + 1)}
                          className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d] font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Line Subtotal */}
                    <td className="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap">
                      <div className={`font-bold ${lineTotal > 0 ? 'text-[#0E01B5] dark:text-[#8c82ff]' : 'text-gray-400'}`}>
                        {formatKes(lineTotal)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matrix Table Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[25, 50, 100]}
        itemLabel="SKUs"
        idPrefix="matrix-bottom"
        className="mt-4 mb-2"
      />

      {/* Floating Matrix Order Bar */}
      <div className="sticky bottom-4 z-30 bg-[#171728] text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Ordered:</span>
            <span className="font-bold text-white text-xs sm:text-sm">
              {totalCases} Cases • {totalBottles} Loose Bottles
            </span>
          </div>

          {totalDiscount > 0 && (
            <div>
              <span className="text-emerald-400 block text-[10px] uppercase font-bold">Bulk Discount:</span>
              <span className="font-bold text-emerald-400 text-xs sm:text-sm">
                -{formatKes(totalDiscount)}
              </span>
            </div>
          )}

          <div>
            <span className="text-[#D4AF37] block text-[10px] uppercase font-bold">Net Total (KES):</span>
            <span className="font-extrabold text-[#FFD700] text-sm sm:text-base">
              {formatKes(netTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {orderLines.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Clear Matrix"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={orderLines.length === 0}
            className={`flex-1 sm:flex-none py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              orderLines.length === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0E01B5] hover:bg-[#09007A] text-white shadow-lg active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                Added {orderLines.length} Items to Wholesale Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add All Lines ({orderLines.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
