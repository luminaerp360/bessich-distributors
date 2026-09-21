import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Wine, 
  Package, 
  Globe, 
  Percent, 
  Warehouse,
  ExternalLink
} from 'lucide-react';
import { Product } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

// PUBLIC MODE: Cart/ordering functionality removed. Orders redirect to The Bar Kenya.

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#171728] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-[#25253d] hover:bg-gray-200 dark:hover:bg-[#30304e] text-gray-700 dark:text-gray-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left: Image & Authenticity */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#12121e] p-6 rounded-xl border border-gray-100 dark:border-gray-800 relative">
            <img
              src={getProductImageUrl(product.image)}
              alt={product.name}
              className="max-h-72 object-contain drop-shadow-md"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, product.fallbackImage)}
            />
            
            <div className="mt-4 w-full bg-white dark:bg-[#1b1b2d] p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>KRA Digital Stamp Verified</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-tight">
                Authentic direct importer batch with tamper-evident excise verification stamp.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>SKU: {product.sku}</span>
                <span>LOT: 2026-BD-{product.category.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Right: Specs & Order */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider mb-1">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.subcategory}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                <Globe className="w-3.5 h-3.5 mx-auto mb-1 text-[#0E01B5] dark:text-[#8c82ff]" />
                <span className="text-[10px] text-gray-400 block">Origin</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block text-[11px]">
                  {product.originFlag} {product.origin.split(',')[0]}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                <Percent className="w-3.5 h-3.5 mx-auto mb-1 text-[#F2693F]" />
                <span className="text-[10px] text-gray-400 block">Alcohol (ABV)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 block text-[11px]">
                  {product.abv}% ABV
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                <Package className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] text-gray-400 block">Case Packaging</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 block text-[11px]">
                  {product.casePack} × {product.volumeMl}ml
                </span>
              </div>
            </div>

            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Wine className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
                  Tasting Profile
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tastingNotes.map((note, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#F5F5DC] dark:bg-[#25253d] text-[#171728] dark:text-gray-200 text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#F5F5DC] dark:border-gray-700"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volume Tier Table */}
            {product.tiers.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-1.5">
                  Wholesale Tier Discounts (Cases)
                </span>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-[#12121e] text-[11px] font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-3 py-1.5">Volume</th>
                        <th className="px-3 py-1.5">Discount</th>
                        <th className="px-3 py-1.5">Price / Case</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      <tr>
                        <td className="px-3 py-1.5 text-gray-600 dark:text-gray-300">Standard (1 - {product.tiers[0].minCases - 1} cases)</td>
                        <td className="px-3 py-1.5 text-gray-500 dark:text-gray-400 font-mono">0%</td>
                        <td className="px-3 py-1.5 font-semibold text-gray-900 dark:text-white">{formatKes(product.casePriceKes)}</td>
                      </tr>
                      {product.tiers.map((tier, index) => {
                        const tierPrice = Math.round(product.casePriceKes * (1 - tier.discountPercentage / 100));
                        return (
                          <tr key={index} className="bg-emerald-50/40 dark:bg-emerald-950/30">
                            <td className="px-3 py-1.5 font-medium text-emerald-950 dark:text-emerald-200">{tier.minCases}+ cases</td>
                            <td className="px-3 py-1.5 font-bold text-emerald-700 dark:text-emerald-400 font-mono">-{tier.discountPercentage}%</td>
                            <td className="px-3 py-1.5 font-bold text-emerald-800 dark:text-emerald-300">{formatKes(tierPrice)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#12121e] p-2 rounded-lg">
              <Warehouse className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
              <span>Central Depot Inventory: </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{product.stockCases} Cases Available</span>
            </div>

            {/* Order CTA — redirects to The Bar Kenya */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <a
                href="https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                Order on The Bar Kenya
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
