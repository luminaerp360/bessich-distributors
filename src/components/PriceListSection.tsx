import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Download, 
  Printer, 
  Search, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers,
  ShoppingCart,
  Package
} from 'lucide-react';
import { Product } from '../types';
import { formatKes } from '../utils/formatters';
import { Pagination } from './Pagination';

interface PriceListSectionProps {
  products: Product[];
  onAddToCart?: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
}

export const PriceListSection: React.FC<PriceListSectionProps> = ({
  products,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const tableTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, searchTerm, selectedCategory]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (tableTopRef.current) {
      const top = tableTopRef.current.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['SKU', 'Brand', 'Product Name', 'Category', 'Origin', 'ABV (%)', 'Case Pack', 'Bottle Price (KES)', 'Case Price (KES)', 'MOQ Cases', 'Max Volume Discount (%)'];
    const rows = products.map((p) => [
      p.sku,
      `"${p.brand}"`,
      `"${p.name}"`,
      p.category,
      `"${p.origin}"`,
      p.abv,
      p.casePack,
      p.bottlePriceKes,
      p.casePriceKes,
      p.moqCases,
      p.tiers.length > 0 ? p.tiers[p.tiers.length - 1].discountPercentage : 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bessich_Distributors_Wholesale_Pricelist_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#171728] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Official Certified Price Sheet
          </div>
          <h2 className="hero-heading text-xl sm:text-2xl font-extrabold text-[#171728] dark:text-white font-display">
            2026 Wholesale Liquor & Wine Price List
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Bessich Distributors Eldoret Central Depot • All prices in KES inclusive of 16% VAT and KRA Excise Duty.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-gray-100 dark:bg-[#25253d] hover:bg-gray-200 dark:hover:bg-[#30304e] text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Sheet
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF9F6] dark:bg-[#12121e] p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search price list by SKU or brand..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1b1b2d] rounded-lg border border-gray-300 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-[#0E01B5]"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:flex md:items-center gap-1.5 w-full md:w-auto text-xs">
          {['all', 'whiskey', 'gin', 'vodka', 'wine', 'beer_cider', 'rum', 'brandy', 'champagne', 'liqueur'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1.5 md:px-3 rounded-lg font-semibold whitespace-nowrap transition-colors capitalize cursor-pointer text-[11px] md:text-xs text-center ${
                selectedCategory === cat
                  ? 'bg-[#0E01B5] text-white'
                  : 'bg-white dark:bg-[#1b1b2d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#25253d]'
              }`}
            >
              {cat === 'all' ? 'All' : cat === 'beer_cider' ? 'Beers' : cat}
            </button>
          ))}
        </div>
      </div>

      <div ref={tableTopRef} className="scroll-mt-24" />

      {/* Mobile Cards (visible below md) */}
      <div className="md:hidden space-y-3">
        {paginated.length > 0 ? (
          paginated.map((product) => {
            const maxTier = product.tiers.length > 0 
              ? product.tiers[product.tiers.length - 1].discountPercentage 
              : 0;

            return (
              <div key={product.id} className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-xs">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold font-mono text-[#0E01B5] dark:text-[#8c82ff] uppercase">
                      {product.sku}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-0.5 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{product.brand}</p>
                  </div>
                  {product.kraStampVerified && (
                    <span className="shrink-0 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      KRA
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg">
                    <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Origin / ABV</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{product.originFlag} {product.abv}%</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg">
                    <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Case Pack</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{product.casePack} × {product.volumeMl}ml</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg">
                    <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Bottle Price</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatKes(product.bottlePriceKes)}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg">
                    <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Case Price</span>
                    <span className="font-bold text-[#0E01B5] dark:text-[#8c82ff]">{formatKes(product.casePriceKes)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {maxTier > 0 ? (
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded text-[10px] font-bold">
                      Save up to {maxTier}% on bulk
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-[10px]">Flat rate pricing</span>
                  )}
                  {onAddToCart ? (
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, 'case', 1)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Order
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs">
            No products matched your search or category filter.
          </div>
        )}
      </div>

      {/* Desktop Table (visible md+) */}
      <div className="hidden md:block bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#12121e] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 sm:px-4">SKU Code</th>
                <th className="py-2.5 px-3 sm:px-4">Product Brand & Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Origin / ABV</th>
                <th className="py-2.5 px-3">Case Pack</th>
                <th className="py-2.5 px-3">Bottle Price (KES)</th>
                <th className="py-2.5 px-3">Case Wholesale (KES)</th>
                <th className="py-2.5 px-3">Bulk Tier Savings</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginated.length > 0 ? (
                paginated.map((product) => {
                  const maxTier = product.tiers.length > 0 
                    ? product.tiers[product.tiers.length - 1].discountPercentage 
                    : 0;

                  return (
                    <tr key={product.id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors">
                      <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-[#0E01B5] dark:text-[#8c82ff]">
                        {product.sku}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">{product.brand}</div>
                      </td>
                      <td className="py-2.5 px-3 capitalize text-gray-600 dark:text-gray-400">
                        {product.subcategory}
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {product.originFlag} {product.abv}% ABV
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {product.casePack} × {product.volumeMl}ml
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">
                        {formatKes(product.bottlePriceKes)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">
                        {formatKes(product.casePriceKes)}
                      </td>
                      <td className="py-2.5 px-3">
                        {maxTier > 0 ? (
                          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Up to -{maxTier}%
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-[10px]">Flat rate</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-right">
                        {onAddToCart ? (
                          <button
                            type="button"
                            onClick={() => onAddToCart(product, 'case', 1)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Order
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs">
                    No products matched your search or category filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[25, 50, 100]}
        itemLabel="SKUs"
        idPrefix="pricelist-bottom"
        className="mt-4"
      />
    </div>
  );
};
