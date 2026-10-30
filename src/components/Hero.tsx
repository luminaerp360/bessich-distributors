import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Truck, 
  ShieldCheck, 
  Percent, 
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ProductCategory } from '../types';

// PUBLIC MODE: B2B account card, credit buttons, and stats commented out for admin-only restoration later

interface HeroProps {
  onExploreCatalog: (category?: ProductCategory) => void;
  // onOpenMatrix: () => void;          // TODO: Admin-only - matrix order pad
  // onOpenCreditModal: () => void;     // TODO: Admin-only - credit application
  // b2bProfile: B2BProfile;            // TODO: Admin-only - account status
}

interface HeroSlide {
  id: string;
  tag: string;
  headlineLine1: string;
  headlineLine2: string;
  subtitle: string;
  packshot: string;
  fallbackPackshot: string;
  heroBg: string;
  category: ProductCategory;
  scaleClass?: string;
  badgeTop: string;
  badgeBottom: string;
  badgeColor: string;
  bgGradient: string;
  curtainColor: string;
  accentColor: string;
  legalText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'jw-black',
    tag: 'PRESTIGE SCOTCH WHISKY • 2026 COLLECTION',
    headlineLine1: 'IGNITE THE',
    headlineLine2: 'SMOLDERING RICHNESS',
    subtitle:
      'Iconic 12-year-old blended Scotch whisky with layers of dark fruits, sweet vanilla, and signature peat smoke — supplied direct to leading hotels, lounges, and retail stores across Eldoret and Western Kenya.',
    packshot: '/hero/packshots/jw-black.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/636862_johnnie_walker_black_label_375ml_bottle_.png',
    heroBg: '/hero/johnnie-walker-hero.jpg',
    category: 'whiskey',
    scaleClass: 'scale-[1.2] sm:scale-[1.35] md:scale-[1.52] lg:scale-[1.62]',
    badgeTop: 'TOP',
    badgeBottom: 'SCOTCH',
    badgeColor: '#F2693F',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(245, 158, 11, 0.42) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(9, 0, 56, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #170e4a 48%, #261205 100%)',
    curtainColor: 'rgba(255, 215, 0, 0.07)',
    accentColor: '#FFD700',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • 100% KRA EXCISE STAMPED GENUINE STOCK',
  },
  {
    id: 'tusker',
    tag: "KENYA'S FLAGSHIP LAGER • COLD-CHAIN DISPATCH",
    headlineLine1: 'CRAFTED KENYAN',
    headlineLine2: 'GOLD HERITAGE',
    subtitle:
      'Brewed with 100% African ingredients: locally malted equatorial barley and pure Aberdare mountain water. Dispatched daily from our 10 regional depots to keep your coolers stocked.',
    packshot: '/hero/packshots/tusker.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/P764354_tusker_lager_500ml_bottle_x6.png',
    heroBg: '/hero/tusker-hero.jpg',
    category: 'beer_cider',
    scaleClass: 'scale-[1.02] sm:scale-[1.08] md:scale-[1.15]',
    badgeTop: 'KENYA',
    badgeBottom: 'NO. 1',
    badgeColor: '#F2693F',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(251, 191, 36, 0.42) 0%, rgba(14, 1, 181, 0.42) 48%, rgba(10, 8, 36, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #1a1842 50%, #2b1a04 100%)',
    curtainColor: 'rgba(255, 215, 0, 0.08)',
    accentColor: '#FFD700',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • DIRECT REGIONAL DEPOT DISPATCH',
  },
  {
    id: 'gilbeys',
    tag: 'DISTILLED LONDON DRY GIN • MIXOLOGY FAVORITE',
    headlineLine1: 'DISTILLED BOTANICAL',
    headlineLine2: 'PERFECTION',
    subtitle:
      'Crafted from 12 classic natural botanicals delivering crisp juniper elegance and a refreshing citrus finish — engineered for high-velocity cocktail bars, lounges, and retail shelves.',
    packshot: '/hero/packshots/gilbeys.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/604021_gilbey_s_special_dry_gin_750ml_bottle_.png',
    heroBg: '/hero/gilbeys-hero.jpg',
    category: 'gin',
    scaleClass: 'scale-[1.2] sm:scale-[1.35] md:scale-[1.52] lg:scale-[1.62]',
    badgeTop: 'TOP',
    badgeBottom: 'SELLER',
    badgeColor: '#F2693F',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(58, 168, 140, 0.45) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(5, 16, 38, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #0b2447 50%, #05261d 100%)',
    curtainColor: 'rgba(255, 255, 255, 0.07)',
    accentColor: '#5fd1b4',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • VERIFIED IMPORTER & DISTILLERY ALLOCATIONS',
  },
  {
    id: 'smirnoff',
    tag: 'TRIPLE DISTILLED & 10X CHARCOAL FILTERED',
    headlineLine1: 'ULTRA SMOOTH',
    headlineLine2: 'CHARCOAL PURITY',
    subtitle:
      'Triple distilled and filtered ten times through seven columns of sustainably sourced charcoal for unmatched smoothness, versatility, and guaranteed commercial bar velocity.',
    packshot: '/hero/packshots/smirnoff.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/650278_smirnoff_red_vodka_750ml_bottle_.png',
    heroBg: '/hero/smirnoff-hero.jpg',
    category: 'vodka',
    scaleClass: 'scale-[1.05] sm:scale-[1.12] md:scale-[1.2]',
    badgeTop: 'PURE',
    badgeBottom: 'NO. 21',
    badgeColor: '#F2693F',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(239, 68, 68, 0.42) 0%, rgba(14, 1, 181, 0.48) 48%, rgba(16, 4, 32, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #1d0c46 50%, #360812 100%)',
    curtainColor: 'rgba(255, 255, 255, 0.07)',
    accentColor: '#FFD700',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • 100% AUTHENTIC FACTORY-SEALED BOTTLES',
  },
  {
    id: 'guinness',
    tag: 'ROASTED BARLEY STOUT • ICONIC POUR',
    headlineLine1: 'DEEP ROASTED',
    headlineLine2: 'EXTRA STOUT',
    subtitle:
      'Exclusively brewed with roasted unmalted barley and hops delivering its unmistakable dark ruby character, bold aroma, and rich creamy head across Rift Valley hospitality venues.',
    packshot: '/hero/packshots/guinness.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/P764356_guinness_foreign_extra_stout_500ml_bottl.png',
    heroBg: '/hero/guinness-hero.jpg',
    category: 'beer_cider',
    scaleClass: 'scale-[1.05] sm:scale-[1.12] md:scale-[1.2]',
    badgeTop: 'EXTRA',
    badgeBottom: 'STOUT',
    badgeColor: '#F2693F',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(217, 119, 6, 0.42) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(12, 8, 28, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #18123e 50%, #261203 100%)',
    curtainColor: 'rgba(255, 215, 0, 0.07)',
    accentColor: '#FFD700',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • JUMBO HOUSE ELDORET & 10 REGIONAL DEPOTS',
  },
];

const StarburstBadge: React.FC<{ top: string; bottom: string; color?: string }> = ({
  top,
  bottom,
  color = '#F2693F',
}) => (
  <div className="relative w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 lg:w-34 lg:h-34 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] select-none">
    <svg viewBox="0 0 100 100" className="w-full h-full transform-gpu">
      <path
        d="M50 0 L58 12 L72 7 L76 21 L90 20 L89 35 L100 40 L94 53 L100 64 L89 71 L90 85 L76 84 L72 98 L58 92 L50 104 L42 92 L28 98 L24 84 L10 85 L11 71 L0 64 L6 53 L0 40 L11 35 L10 20 L24 21 L28 7 L42 12 Z"
        fill={color}
      />
      <circle
        cx="50"
        cy="52"
        r="37"
        fill="none"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center leading-none">
      <span className="text-xs sm:text-base md:text-xl lg:text-2xl font-black tracking-tight drop-shadow-md uppercase">
        {top}
      </span>
      <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-extrabold tracking-wider drop-shadow-md uppercase mt-0.5">
        {bottom}
      </span>
    </div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  // onOpenMatrix,        // TODO: Admin-only
  // onOpenCreditModal,   // TODO: Admin-only
  // b2bProfile,          // TODO: Admin-only
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Preload packshots and background images for instant transitions
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const packImg = new Image();
      packImg.src = slide.packshot;
      const bgImg = new Image();
      bgImg.src = slide.heroBg;
    });
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, []);

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#09007a] text-white border-b border-[#171728]">
      {/* Main Extended Hero Stage */}
      <div className="relative w-full min-h-[620px] sm:min-h-[660px] md:h-[680px] lg:h-[730px] xl:h-[760px] overflow-hidden flex items-center">
        {/* Background Slides Layer */}
        {HERO_SLIDES.map((slide, index) => {
          const isCurrent = index === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-250 ease-out ${
                isCurrent ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
              style={{ background: slide.bgGradient }}
            >
              {/* Dual Scaled Ambient Backdrop Bottles (Reduced size & Duplicated) */}
              <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-6 md:px-12 lg:px-20 pointer-events-none overflow-hidden select-none">
                {/* Left Duplicated Backdrop Bottle */}
                <img
                  src={slide.heroBg}
                  alt=""
                  className="h-[46%] sm:h-[56%] md:h-[64%] lg:h-[70%] max-h-[440px] w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[340px] object-contain opacity-18 sm:opacity-20 mix-blend-luminosity filter blur-[0.5px] -rotate-6 transform-gpu"
                />
                {/* Right Duplicated Backdrop Bottle */}
                <img
                  src={slide.heroBg}
                  alt=""
                  className="h-[50%] sm:h-[60%] md:h-[70%] lg:h-[76%] max-h-[480px] w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[380px] object-contain opacity-22 sm:opacity-25 mix-blend-luminosity filter blur-[0.5px] rotate-6 transform-gpu"
                />
              </div>
              {/* Curtain Light Rays */}
              <div
                className="absolute inset-0 pointer-events-none opacity-75"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent 0%, transparent 6%, ${slide.curtainColor} 11%, transparent 16%, transparent 22%, ${slide.curtainColor} 27%, transparent 32%)`,
                }}
              />
              {/* Subtle Architectural Grid & Vignette */}
              <div className="absolute inset-0 opacity-12 [background-image:linear-gradient(rgba(255,215,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.12)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none" />
            </div>
          );
        })}

        {/* Content & Unboxed Bottle Packshot Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-0 h-full flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left Column: Synchronized Changing / Flipping Hero Copy */}
          <div className="w-full md:w-[54%] flex flex-col items-center md:items-start text-center md:text-left justify-center [perspective:1200px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-3.5 sm:space-y-4 md:space-y-5 origin-center w-full"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FFD700]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{activeSlide.tag}</span>
                </div>

                <h1 className="text-white font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.15rem] tracking-tight leading-[0.98] uppercase font-display drop-shadow-2xl">
                  <span>{activeSlide.headlineLine1}</span>
                  <br />
                  <span style={{ color: activeSlide.accentColor }}>{activeSlide.headlineLine2}</span>
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-white/85 max-w-xl font-medium leading-relaxed drop-shadow-md">
                  {activeSlide.subtitle}
                </p>

                {/* Value Props Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 text-left">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#FFD700] shrink-0" />
                    <span>100% Genuine KRA Stamped</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 shadow-sm">
                    <Truck className="w-4 h-4 text-[#F2693F] shrink-0" />
                    <span>10 Regional Depots (24H)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 shadow-sm">
                    <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>For Wholesale: Contact Shop</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button
                    id="hero-btn-explore"
                    type="button"
                    onClick={() => onExploreCatalog(activeSlide.category)}
                    className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-[#0E01B5] hover:bg-[#2516e0] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-xl shadow-black/35 border border-white/20 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Browse Full Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onExploreCatalog()}
                    className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-[#F2693F] hover:bg-[#d9562e] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Start Your Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-1 text-[10px] sm:text-xs text-white/75 font-bold uppercase tracking-wider">
                  {activeSlide.legalText}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Free-Standing Transparent Bottle Packshot (No Card Container) */}
          <div className="w-full md:w-[46%] h-[250px] sm:h-[300px] md:h-[480px] lg:h-[540px] flex items-center justify-center relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Floating Starburst Seal Badge */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-1 right-4 sm:top-4 sm:right-8 md:top-10 md:right-2 lg:right-6 z-20 pointer-events-none"
                >
                  <StarburstBadge
                    top={activeSlide.badgeTop}
                    bottom={activeSlide.badgeBottom}
                    color={activeSlide.badgeColor}
                  />
                </motion.div>

                {/* Realistic Ground Contact Shadow under the Bottle */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-56 sm:w-72 md:w-88 h-6 bg-black/90 rounded-[100%] blur-[11px] pointer-events-none" />

                {/* Free-Standing Bottle Cutout */}
                <img
                  src={activeSlide.packshot}
                  onError={(e) => {
                    if (e.currentTarget.src !== activeSlide.fallbackPackshot) {
                      e.currentTarget.src = activeSlide.fallbackPackshot;
                    }
                  }}
                  alt={`${activeSlide.headlineLine1} ${activeSlide.headlineLine2}`}
                  loading="eager"
                  onClick={() => onExploreCatalog(activeSlide.category)}
                  className={`relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.92)] transition-transform duration-500 cursor-pointer ${
                    activeSlide.scaleClass || 'scale-100'
                  } hover:brightness-105`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Left / Right Slide Navigation Buttons */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/35 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/35 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Slide Indicator Pills */}
        <div
          className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto"
          aria-label="Hero background slides"
        >
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlideIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.headlineLine2}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlideIndex
                  ? 'w-10 bg-[#FFD700]'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
