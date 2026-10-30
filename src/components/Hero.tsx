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
    id: 'aberlour-16',
    tag: 'PRESTIGE SPEYSIDE SINGLE MALT • AGED 16 YEARS',
    headlineLine1: 'DOUBLE CASK',
    headlineLine2: 'SPEYSIDE PERFECTION',
    subtitle:
      'Matured in first-fill American oak ex-bourbon casks and the finest seasoned Oloroso sherry butts — delivering rich floral aromas, sweet raisin nectar, and a velvety smooth spicy finish.',
    packshot: 'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/bessich-dist/products/1793117617928-aberlour-16yr-dbl-cask-700ml-g3oau.jpg',
    fallbackPackshot: 'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/bessich-dist/products/1793117617928-aberlour-16yr-dbl-cask-700ml-g3oau.jpg',
    heroBg: 'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/bessich-dist/products/1793117617928-aberlour-16yr-dbl-cask-700ml-g3oau.jpg',
    category: 'whiskey',
    scaleClass: 'scale-[1.0] sm:scale-[1.05] md:scale-[1.08] lg:scale-[1.12]',
    badgeTop: '16 YR',
    badgeBottom: 'SPEYSIDE',
    badgeColor: '#D97706',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(245, 158, 11, 0.42) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(9, 0, 56, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #170e4a 48%, #261205 100%)',
    curtainColor: 'rgba(255, 215, 0, 0.07)',
    accentColor: '#FFD700',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • 100% KRA EXCISE STAMPED GENUINE ALLOCATIONS',
  },
  {
    id: 'tusker-6pack',
    tag: "KENYA'S FLAGSHIP LAGER • 6-BOTTLE CARRIER BOX",
    headlineLine1: 'CRAFTED KENYAN',
    headlineLine2: 'GOLD HERITAGE',
    subtitle:
      'Brewed with 100% African ingredients: locally malted equatorial barley, golden corn starch, and Aberdare mountain water. Supplied in convenient 6-bottle carrier boxes directly to your coolers.',
    packshot: '/hero/packshots/tusker.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/P764354_tusker_lager_500ml_bottle_x6.png',
    heroBg: '/hero/tusker-hero.jpg',
    category: 'beer_cider',
    scaleClass: 'scale-[1.0] sm:scale-[1.04] md:scale-[1.06] lg:scale-[1.1]',
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
    id: 'absolut-vodka',
    tag: 'SWEDISH WINTER WHEAT • CONTINUOUS DISTILLATION',
    headlineLine1: 'ICONIC PURITY',
    headlineLine2: 'WINTER WHEAT SMOOTH',
    subtitle:
      'Crafted in Åhus from rich southern Swedish winter wheat and pristine deep-well water with zero added sugar — the definitive bar essential for modern cocktail venues across Kenya.',
    packshot: 'https://glovo.dhmedia.io/image/pim-glovo/671a37c1f023cfb7853197b2.jpg?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MzIwLCJoZWlnaHQiOjMyMH19XQ==',
    fallbackPackshot: 'https://glovo.dhmedia.io/image/pim-glovo/671a37c1f023cfb7853197b2.jpg?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MzIwLCJoZWlnaHQiOjMyMH19XQ==',
    heroBg: 'https://glovo.dhmedia.io/image/pim-glovo/671a37c1f023cfb7853197b2.jpg?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MzIwLCJoZWlnaHQiOjMyMH19XQ==',
    category: 'vodka',
    scaleClass: 'scale-[1.0] sm:scale-[1.04] md:scale-[1.06] lg:scale-[1.1]',
    badgeTop: '1000ML',
    badgeBottom: 'ORIGINAL',
    badgeColor: '#0E01B5',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(59, 130, 246, 0.42) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(8, 12, 40, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #0d1e4c 50%, #03122c 100%)',
    curtainColor: 'rgba(255, 255, 255, 0.08)',
    accentColor: '#60A5FA',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • DIRECT REGIONAL DEPOT DISPATCH',
  },
  {
    id: 'tusker-malt-6pack',
    tag: '100% PREMIUM MALT • 6-BOTTLE CARRIER BOX',
    headlineLine1: 'SLOW BREWED',
    headlineLine2: 'FULLER FLAVOUR',
    subtitle:
      'Masterfully brewed with 100% pure malted barley and slow-fermented for an exceptionally rich, deep, and satisfying character — supplied in 6-bottle carrier boxes to premier lounges across Rift Valley.',
    packshot: '/hero/packshots/tusker-malt.png',
    fallbackPackshot:
      'https://lumina360.sfo3.digitaloceanspaces.com/eccomerse/cyden/products/P764332_tusker_malt_lager_330ml_bottle_x6.png',
    heroBg: '/hero/tusker-hero.jpg',
    category: 'beer_cider',
    scaleClass: 'scale-[1.0] sm:scale-[1.04] md:scale-[1.06] lg:scale-[1.1]',
    badgeTop: '100%',
    badgeBottom: 'MALT',
    badgeColor: '#047857',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(16, 185, 129, 0.42) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(4, 28, 18, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #063124 50%, #021a12 100%)',
    curtainColor: 'rgba(52, 211, 153, 0.08)',
    accentColor: '#34D399',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • 100% KRA EXCISE STAMPED GENUINE ALLOCATIONS',
  },
  {
    id: 'asconi-pastoral',
    tag: 'MOLDOVAN HERITAGE SELECTION • VELVET DESSERT RED',
    headlineLine1: 'RICH & LUSCIOUS',
    headlineLine2: 'PASTORAL RED RESERVE',
    subtitle:
      'Full-bodied dessert red wine crafted from select Cabernet Sauvignon grapes, presenting opulent aromas of blackcurrant, dried plum, and chocolate nuances for fine dining establishments.',
    packshot: 'https://glovo.dhmedia.io/image/pim-glovo/671a3795f023cfb7853196dd?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MzIwLCJoZWlnaHQiOjMyMH19XQ==',
    fallbackPackshot: 'https://glovo.dhmedia.io/image/pim-glovo/671a3795f023cfb7853196dd?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MzIwLCJoZWlnaHQiOjMyMH19XQ==',
    heroBg: 'https://glovo.dhmedia.io/image/pim-glovo/671a3795f023cfb7853196dd?t=W3sicmVzaXplIjp7Im1vZGUiOiJmaXQiLCJ3aWR0aCI6MzIwLCJoZWlnaHQiOjMyMH19XQ==',
    category: 'wine',
    scaleClass: 'scale-[1.0] sm:scale-[1.05] md:scale-[1.08] lg:scale-[1.12]',
    badgeTop: 'ESTATE',
    badgeBottom: 'RED',
    badgeColor: '#B91C1C',
    bgGradient:
      'radial-gradient(ellipse at 70% 50%, rgba(185, 28, 28, 0.42) 0%, rgba(14, 1, 181, 0.45) 48%, rgba(20, 4, 16, 0.98) 88%), linear-gradient(125deg, #09007a 0%, #2d0a1b 50%, #150209 100%)',
    curtainColor: 'rgba(255, 215, 0, 0.07)',
    accentColor: '#F87171',
    legalText: 'ENJOY RESPONSIBLY | 18+ ONLY • ELDORET CENTRAL HQ & ALL BRANCHES',
  },
];

const StarburstBadge: React.FC<{ top: string; bottom: string; color?: string }> = ({
  top,
  bottom,
  color = '#F2693F',
}) => (
  <div className="relative w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] select-none">
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
      <div className="relative w-full min-h-[560px] md:min-h-[520px] md:h-[calc(100vh-64px)] md:max-h-[650px] lg:max-h-[700px] xl:max-h-[740px] overflow-hidden flex items-center">
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
                  className="h-[42%] sm:h-[50%] md:h-[58%] lg:h-[64%] max-h-[360px] w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[300px] object-contain opacity-18 sm:opacity-20 mix-blend-luminosity filter blur-[0.5px] -rotate-6 transform-gpu"
                />
                {/* Right Duplicated Backdrop Bottle */}
                <img
                  src={slide.heroBg}
                  alt=""
                  className="h-[46%] sm:h-[54%] md:h-[62%] lg:h-[68%] max-h-[390px] w-auto max-w-[210px] sm:max-w-[260px] md:max-w-[320px] object-contain opacity-22 sm:opacity-25 mix-blend-luminosity filter blur-[0.5px] rotate-6 transform-gpu"
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-4 md:py-2 h-full flex flex-col-reverse md:flex-row items-center justify-between gap-3 md:gap-6">
          
          {/* Left Column: Synchronized Changing / Flipping Hero Copy */}
          <div className="w-full md:w-[54%] flex flex-col items-center md:items-start text-center md:text-left justify-center [perspective:1200px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-2.5 sm:space-y-3 md:space-y-3 lg:space-y-3.5 origin-center w-full"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FFD700]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{activeSlide.tag}</span>
                </div>

                <h1 className="text-white font-black text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[3.25rem] tracking-tight leading-[1.02] uppercase font-display drop-shadow-2xl">
                  <span>{activeSlide.headlineLine1}</span>
                  <br />
                  <span style={{ color: activeSlide.accentColor }}>{activeSlide.headlineLine2}</span>
                </h1>

                <p className="text-xs sm:text-sm text-white/85 max-w-xl font-medium leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-none">
                  {activeSlide.subtitle}
                </p>

                {/* Value Props Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 pt-0.5 text-left">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#FFD700] shrink-0" />
                    <span>100% Genuine KRA Stamped</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 shadow-sm">
                    <Truck className="w-4 h-4 text-[#F2693F] shrink-0" />
                    <span>10 Regional Depots (24H)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-white/90 bg-white/10 border border-white/20 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 shadow-sm">
                    <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>For Wholesale: Contact Shop</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-0.5 sm:pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                  <button
                    id="hero-btn-explore"
                    type="button"
                    onClick={() => onExploreCatalog(activeSlide.category)}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#0E01B5] hover:bg-[#2516e0] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-xl shadow-black/35 border border-white/20 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Browse Full Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onExploreCatalog()}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#F2693F] hover:bg-[#d9562e] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Start Your Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-0.5 text-[9px] sm:text-[10px] md:text-[11px] text-white/70 font-bold uppercase tracking-wider">
                  {activeSlide.legalText}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Uniform Showcase Card Stage (Same Uniform White Background across all bottles) */}
          <div className="w-full md:w-[46%] h-[240px] sm:h-[280px] md:h-[84%] lg:h-[90%] max-h-[380px] md:max-h-[440px] lg:max-h-[480px] flex items-center justify-center relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="relative h-full flex items-center justify-center"
              >
                {/* Uniform White Showcase Stage Container */}
                <div 
                  onClick={() => onExploreCatalog(activeSlide.category)}
                  className="relative h-full aspect-[4/5] bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/30 flex items-center justify-center overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
                >
                  {/* Subtle Podium Ambient Glow on the Floor of the Card */}
                  <div className="absolute -bottom-6 inset-x-0 h-20 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />
                  
                  {/* Contact Shadow under the Bottle */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-3.5 bg-black/15 rounded-[100%] blur-[6px] pointer-events-none" />

                  {/* Product Packshot Image - Centered and Uniformly Scaled */}
                  <img
                    src={activeSlide.packshot}
                    onError={(e) => {
                      if (e.currentTarget.src !== activeSlide.fallbackPackshot) {
                        e.currentTarget.src = activeSlide.fallbackPackshot;
                      }
                    }}
                    alt={`${activeSlide.headlineLine1} ${activeSlide.headlineLine2}`}
                    loading="eager"
                    className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Floating Starburst Seal Badge - Anchored to Top-Right of the Uniform Card */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18, delay: 0.05 }}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 md:-top-4 md:-right-4 z-20 pointer-events-none"
                >
                  <StarburstBadge
                    top={activeSlide.badgeTop}
                    bottom={activeSlide.badgeBottom}
                    color={activeSlide.badgeColor}
                  />
                </motion.div>
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
          className="absolute bottom-2 sm:bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto"
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
