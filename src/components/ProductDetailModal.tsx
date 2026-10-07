import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Wine, 
  Package, 
  Globe, 
  Percent, 
  ShoppingCart,
  PhoneCall
} from 'lucide-react';
import { Product } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
  onNavigate?: (page: 'contact' | 'catalog') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onNavigate,
}) => {
  const [orderType, setOrderType] = useState<'case' | 'bottle'>('case');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const unitPrice = orderType === 'case' ? product.casePriceKes : Math.round(product.casePriceKes / product.casePack);
  const lineTotal = unitPrice * quantity;

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

            {/* Active Promotional Offer Banner */}
            {product.isPromoActive && (
              <div className="bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-orange-500/15 border border-rose-300 dark:border-rose-800/70 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    🔥
                  </span>
                  <div>
                    <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                      {product.promoBadgeText || 'SPECIAL OFFER'}
                      {product.savingsPercentage && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {product.savingsPercentage}% OFF
                        </span>
                      )}
                    </span>
                    <p className="text-[11px] text-gray-700 dark:text-gray-200 font-semibold">
                      {product.savingsAmountBottleKes
                        ? `Save KES ${formatKes(product.savingsAmountBottleKes)}/btl (KES ${formatKes(product.savingsAmountKes || product.savingsAmountBottleKes * product.casePack)}/case)`
                        : product.savingsAmountKes
                        ? `Save KES ${formatKes(product.savingsAmountKes)} per case`
                        : 'Promotional price active'}
                    </p>
                  </div>
                </div>
                {product.promoEndDate && (
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-[#1f1f33] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                    Offer ends: {new Date(product.promoEndDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

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

            {/* Wholesale Inquiries Notice */}
            <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/70 dark:bg-[#18182e] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-950 dark:text-blue-300 block text-xs flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
                  Looking for Wholesale or Bulk Commercial Supply?
                </span>
                <span className="text-[11px] text-blue-800/80 dark:text-blue-400 block leading-tight">
                  For wholesale pallet orders &amp; commercial supply contracts, please contact our shop directly.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('contact');
                }}
                className="shrink-0 bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
              >
                Contact Shop
              </button>
            </div>

            {/* Order CTA — Add to Cart */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {/* Price Display */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {product.isPromoActive ? 'Special Offer Price:' : 'Unit Price:'}
                </span>
                <div className="flex items-baseline gap-2">
                  {product.isPromoActive && (
                    (() => {
                      const compareVal = orderType === 'case'
                        ? (product.compareAtPriceKes || Math.round(unitPrice / (1 - (product.savingsPercentage || 15) / 100)))
                        : (product.compareAtBottlePriceKes || Math.round((product.compareAtPriceKes || 0) / product.casePack) || Math.round(unitPrice / (1 - (product.savingsPercentage || 15) / 100)));
                      return compareVal > unitPrice ? (
                        <span className="text-xs text-gray-400 line-through font-semibold">
                          {formatKes(compareVal)}
                        </span>
                      ) : null;
                    })()
                  )}
                  <span className={`font-bold ${product.isPromoActive ? 'text-rose-600 dark:text-rose-400 text-sm' : 'text-gray-900 dark:text-white'}`}>
                    {formatKes(unitPrice)}
                  </span>
                </div>
              </div>

              {/* Case / Bottle Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setOrderType('case'); setQuantity(1); }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    orderType === 'case'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Full Case</span>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{product.casePack} bottles</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap justify-center">
                    {product.isPromoActive && product.compareAtPriceKes && product.compareAtPriceKes > product.casePriceKes && (
                      <span className="text-[10px] text-gray-400 line-through font-semibold">
                        {formatKes(product.compareAtPriceKes)}
                      </span>
                    )}
                    <span className={`font-bold ${product.isPromoActive ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatKes(product.casePriceKes)}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setOrderType('bottle'); setQuantity(1); }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    orderType === 'bottle'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Wine className="w-4 h-4" />
                  <span>Single Bottle</span>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{product.volumeMl}ml</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap justify-center">
                    {product.isPromoActive && (
                      (() => {
                        const cmp = product.compareAtBottlePriceKes || (product.compareAtPriceKes ? Math.round(product.compareAtPriceKes / product.casePack) : 0);
                        return cmp > product.bottlePriceKes ? (
                          <span className="text-[10px] text-gray-400 line-through font-semibold">
                            {formatKes(cmp)}
                          </span>
                        ) : null;
                      })()
                    )}
                    <span className={`font-bold ${product.isPromoActive ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatKes(product.bottlePriceKes)}
                    </span>
                  </div>
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1b1b2d]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e2e48] text-sm font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900 dark:text-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e2e48] text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {orderType === 'case' ? `${quantity * product.casePack} bottles total` : `${quantity} bottle${quantity > 1 ? 's' : ''}`}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => onAddToCart(product, orderType, quantity)}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-[#0E01B5] hover:bg-[#09007A] text-white shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart — {formatKes(lineTotal)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
