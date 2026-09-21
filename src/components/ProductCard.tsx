import React from 'react';
import { 
  ShieldCheck, 
  Info, 
  Sparkles,
  Package,
  ExternalLink
} from 'lucide-react';
import { Product } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

// PUBLIC MODE: Cart/ordering functionality commented out. Orders redirect to The Bar Kenya.

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  // TODO: Admin-only — onAddToCart for cart functionality
  // onAddToCart: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  return (
    <div 
      className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-[#0E01B5]/40 dark:hover:border-[#8c82ff]/60 hover:shadow-lg transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Product Image Area & Badges */}
        <div className="relative h-44 sm:h-48 bg-gradient-to-b from-[#FAF9F6] to-gray-100 dark:from-[#1b1b2d] dark:to-[#12121e] p-3 sm:p-4 flex items-center justify-center overflow-hidden">
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            className="h-full max-h-36 sm:max-h-40 object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, product.fallbackImage)}
          />

          {product.kraStampVerified && (
            <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-2xs backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3" />
              KRA Stamp
            </div>
          )}

          {product.featured && (
            <div className="absolute top-2 right-2 bg-[#171728] text-[#FFD700] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              Popular
            </div>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="absolute bottom-2 right-2 bg-white/90 dark:bg-[#1f1f33]/90 hover:bg-white dark:hover:bg-[#282844] text-gray-700 dark:text-gray-200 p-1.5 rounded-lg text-xs shadow-xs border border-gray-200 dark:border-gray-700 hover:text-[#0E01B5] dark:hover:text-[#8c82ff] transition-colors cursor-pointer"
            title="View full specs"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4 space-y-2 sm:space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="flex items-center gap-1">
              <span>{product.originFlag}</span>
              <span>{product.abv}% ABV</span>
            </span>
          </div>

          <h3 
            onClick={() => onOpenDetails(product)}
            className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1 hover:text-[#0E01B5] dark:hover:text-[#8c82ff] transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="bg-gray-100 dark:bg-[#25253d] px-1 py-0.5 rounded text-gray-700 dark:text-gray-300 font-mono">
              SKU: {product.sku}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 text-gray-400" />
              {product.volumeMl}ml • {product.casePack} btls/case
            </span>
          </div>

          {/* Pricing */}
          <div className="bg-[#FAF9F6] dark:bg-[#12121e] p-2 sm:p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase block">
                  Wholesale Case Price
                </span>
                <span className="text-sm sm:text-base font-bold text-[#171728] dark:text-white">
                  {formatKes(product.casePriceKes)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium block">
                  Per Bottle equiv.
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#686781] dark:text-gray-400">
                  {formatKes(Math.round(product.casePriceKes / product.casePack))}
                </span>
              </div>
            </div>

            {product.tiers.length > 0 && (
              <div className="mt-1 pt-1 border-t border-gray-200/60 dark:border-gray-700 flex items-center justify-between text-[9px] sm:text-[10px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium truncate">
                  Up to {product.tiers[product.tiers.length - 1].discountPercentage}% Bulk Discount
                </span>
                <span className="text-gray-400 shrink-0 ml-1">
                  {product.tiers[0].minCases}+ cs
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Action — redirects to The Bar Kenya */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4">
        <a
          href="https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Order on The Bar Kenya</span>
        </a>
      </div>
    </div>
  );
};
