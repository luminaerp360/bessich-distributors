import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Info, 
  Sparkles,
  Plus,
  Minus,
  Check,
  Wine
} from 'lucide-react';
import { Product } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

export interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
  cartQuantity?: number;
  cartIndex?: number;
  onUpdateCartQuantity?: (index: number, quantity: number) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  cartQuantity = 0,
  cartIndex = -1,
  onUpdateCartQuantity,
  index = 0,
}) => {
  const [justAddedAnim, setJustAddedAnim] = useState<number | null>(null);
  const [hasFailedImage, setHasFailedImage] = useState(false);

  const handleCardClick = () => {
    onOpenDetails(product);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 'bottle', 1);
    setJustAddedAnim(Date.now());
  };

  // Single bottle price calculations
  const bottlePrice = product.bottlePriceKes;
  const rawCompareAtBottle =
    product.compareAtBottlePriceKes ||
    (product.compareAtPriceKes ? Math.round(product.compareAtPriceKes / product.casePack) : undefined);

  // Strikethrough compare-at price must always be strictly greater than the promotional price
  const compareAtBottle =
    rawCompareAtBottle && rawCompareAtBottle > bottlePrice
      ? rawCompareAtBottle
      : product.isPromoActive
      ? Math.round(bottlePrice / (1 - (product.savingsPercentage || 15) / 100))
      : undefined;

  const bottleSavings =
    product.savingsAmountBottleKes && product.savingsAmountBottleKes > 0
      ? product.savingsAmountBottleKes
      : compareAtBottle && compareAtBottle > bottlePrice
      ? compareAtBottle - bottlePrice
      : 0;

  const hasValidCompareAt = Boolean(compareAtBottle && compareAtBottle > bottlePrice);

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.2) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className={`group flex flex-col bg-white dark:bg-[#171728] rounded-2xl border transition-all duration-300 overflow-hidden relative select-none cursor-pointer hover:border-[#3AA88C] dark:hover:border-[#3AA88C] shadow-xs hover:shadow-xl ${
        cartQuantity > 0
          ? 'border-[#3AA88C] ring-2 ring-[#3AA88C]/20 shadow-sm'
          : 'border-neutral-200/90 dark:border-neutral-800'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`${product.name} - ${formatKes(bottlePrice)} per bottle. Click to view details.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Floating "+1" Burst Animation on Add */}
      <AnimatePresence>
        {justAddedAnim && (
          <motion.div
            key={justAddedAnim}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -36, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none px-3.5 py-1.5 rounded-full bg-[#1B3E6F] text-white text-xs font-black shadow-xl flex items-center gap-1.5 border border-white/30 backdrop-blur-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#3AA88C] stroke-[3]" />
            <span>Added to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges Top Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {/* Left Badge: PROMO OFFER (PRIORITY) or Popular / Wholesale */}
        {product.isPromoActive ? (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
            <span>🔥</span>
            <span>
              {product.promoBadgeText ||
                (product.savingsPercentage
                  ? `-${product.savingsPercentage}% OFF`
                  : 'SPECIAL OFFER')}
            </span>
          </span>
        ) : product.featured ? (
          <span className="inline-flex items-center gap-1 bg-[#1B3E6F]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Popular
          </span>
        ) : (
          <span />
        )}

        {/* Right Badge: In-Cart or KRA Stamp */}
        {cartQuantity > 0 ? (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#3AA88C] text-white shadow-xs"
          >
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{cartQuantity} in cart</span>
          </motion.span>
        ) : product.kraStampVerified ? (
          <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>KRA Stamp</span>
          </span>
        ) : (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3AA88C]/15 text-[#2C856E] dark:text-[#5fd1b4]">
            Quick add
          </span>
        )}
      </div>

      {/* Product Image Stage */}
      <div className="relative w-full h-48 sm:h-52 bg-gradient-to-b from-[#FAF9F6] to-neutral-100/70 dark:from-[#1b1b2d] dark:to-[#12121e] p-4 flex items-center justify-center overflow-hidden">
        {!hasFailedImage ? (
          <motion.img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            onError={(e) => {
              handleImageError(e, product.fallbackImage);
              setHasFailedImage(true);
            }}
            loading="lazy"
            referrerPolicy="no-referrer"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal filter drop-shadow-sm pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-[#25253d] shadow-xs flex items-center justify-center text-[#3AA88C] mb-2">
              <Wine className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-neutral-500">{product.brand}</span>
          </div>
        )}

        {/* View Specs Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="absolute bottom-2.5 right-2.5 bg-white/90 dark:bg-[#1f1f33]/90 hover:bg-white dark:hover:bg-[#282844] text-gray-600 dark:text-gray-300 p-1.5 rounded-lg text-xs shadow-xs border border-gray-200 dark:border-gray-700 hover:text-[#3AA88C] dark:hover:text-[#3AA88C] transition-all cursor-pointer z-10"
          title="View specifications"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        {/* Brand & Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span className="text-[#3AA88C] font-bold uppercase tracking-wider text-[11px] truncate">
              {product.brand}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 font-semibold text-[11px] shrink-0 ml-1">
              {product.volumeMl}ml
            </span>
          </div>

          {/* Product Title */}
          <h3
            className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-[#3AA88C] transition-colors line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-end justify-between gap-2 mt-auto">
          {/* PRICING WITH SPECIAL OFFER HIGHLIGHT (SINGLE BOTTLE PRIMARY) */}
          <div className="min-w-0">
            {product.isPromoActive ? (
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tracking-tight whitespace-nowrap">
                    {formatKes(bottlePrice)}
                  </span>
                  {hasValidCompareAt && (
                    <span className="text-xs sm:text-sm text-neutral-400 line-through font-semibold whitespace-nowrap">
                      {formatKes(compareAtBottle!)}
                    </span>
                  )}
                </div>
                {/* Savings Pill */}
                {bottleSavings > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200/80 dark:border-rose-900/60 inline-flex items-center gap-1">
                      <span>
                        Save {formatKes(bottleSavings)}
                      </span>
                      {product.savingsPercentage && (
                        <span>({product.savingsPercentage}% OFF)</span>
                      )}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-neutral-400 block -mt-0.5">
                  {formatKes(product.casePriceKes)}/case ({product.casePack} btls)
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white tracking-tight whitespace-nowrap">
                    {formatKes(bottlePrice)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">/btl</span>
                </div>
                <span className="text-[10px] text-neutral-400 block -mt-0.5">
                  {formatKes(product.casePriceKes)}/case ({product.casePack} btls)
                </span>
              </div>
            )}
          </div>

          {/* ADD BUTTON OR STEPPER */}
          {cartQuantity > 0 ? (
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border border-[#3AA88C] rounded-xl bg-emerald-50/70 dark:bg-[#122B4E]/40 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cartIndex >= 0 && onUpdateCartQuantity) {
                      onUpdateCartQuantity(cartIndex, cartQuantity - 1);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-[#3AA88C] hover:text-white transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-neutral-900 dark:text-white">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, 'bottle', 1);
                    setJustAddedAnim(Date.now());
                  }}
                  className="w-7 h-7 flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-[#3AA88C] hover:text-white transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              className="px-3.5 py-2 rounded-xl bg-[#3AA88C] hover:bg-[#2F8D75] text-white font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title={`Add ${product.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
