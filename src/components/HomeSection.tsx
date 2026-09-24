import React from 'react';
import { 
  Wine, 
  Beer, 
  Flame, 
  Sparkles, 
  GlassWater, 
  ShieldCheck, 
  Truck, 
  Percent, 
  ArrowRight, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Star,
  MapPin,
  ChevronRight,
  PhoneCall,
  Award,
  BarChart3,
  Layers,
  FileText,
  BadgeCheck,
  Check,
  ArrowUpRight,
  Boxes,
  Compass,
  Warehouse
} from 'lucide-react';
import { Hero } from './Hero';
import { Product, ProductCategory, ActivePage } from '../types';

interface HomeSectionProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onNavigate: (page: ActivePage, category?: ProductCategory) => void;
  onAddToCart: (product: Product, orderType: 'case' | 'bottle', quantity: number) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  products,
  onNavigate,
  onOpenDetails,
  onAddToCart,
}) => {
  const categoryHighlights = [
    {
      id: 'wine' as ProductCategory,
      label: 'Fine Wines & Champagne',
      tagline: 'Direct Cellars & Sparkling Allocations',
      description: 'Exclusive imports from leading vineyards across the Cape and Champagne terroirs. Curated for fine dining, weddings, and premium hospitality venues.',
      icon: Wine,
      accent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      keyBrands: 'Moët & Chandon Nectar Impérial, Four Cousins Sweet Red, Cellar Cask',
      badge: 'Direct Cellar'
    },
    {
      id: 'whiskey' as ProductCategory,
      label: 'Single Malts & Rare Whiskies',
      tagline: 'Scotch, Irish & Tennessee Reserves',
      description: 'The definitive selection of aged Scotch, Irish single malts, and American Tennessee sour mash whiskies commanding top-shelf prominence.',
      icon: Flame,
      accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      keyBrands: 'Johnnie Walker Blue & Double Black, Jameson, Chivas 12 & 15YO, Jack Daniel’s, Vat 69',
      badge: 'High Velocity'
    },
    {
      id: 'gin' as ProductCategory,
      label: 'Botanical Gins & Fine Vodkas',
      tagline: 'London Dry, Flavoured & Pure Spirits',
      description: 'Export strength London dry gins, natural botanical infusions, and winter wheat vodkas engineered for premier cocktail lounges and high-volume bars.',
      icon: Sparkles,
      accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      keyBrands: 'Tanqueray London Dry, Beefeater (Pink & Blood Orange), Gordon’s, Absolut, Kibao, Chrome',
      badge: 'Mixology Focus'
    },
    {
      id: 'beer_cider' as ProductCategory,
      label: 'Cold-Chain Beers & Ciders',
      tagline: 'Cans, Kegs & Refreshing Ciders',
      description: 'Guaranteed supply of Kenya’s favorite lagers and crisp apple ciders, dispatched directly from our regional branch network.',
      icon: Beer,
      accent: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
      keyBrands: 'Tusker Lager Cans, Balozi Can, Pilsner Can, Hunter’s Dry Cider',
      badge: 'Cold-Chain Delivery'
    },
    {
      id: 'brandy' as ProductCategory,
      label: 'Fine Cognacs & Liqueurs',
      tagline: 'VS, VSOP & Artisanal Aperitifs',
      description: 'Distinguished French cognacs, tropical cream liqueurs, and spiced rums essential for bottle service, VIP lounges, and celebration pours.',
      icon: GlassWater,
      accent: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      keyBrands: 'Martell Blue Swift, Martell VS, Jägermeister, Amarula Cream, Captain Morgan, Richot',
      badge: 'VIP Bottle Service'
    },
  ];

  const brandPartners = [
    { name: 'Diageo / EABL', role: 'Official Distribution Partner', region: 'East Africa' },
    { name: 'Pernod Ricard', role: 'Authorized Prestige Importer', region: 'Global Imports' },
    { name: 'KWAL', role: 'Wines & Spirits Partner', region: 'National' },
    { name: 'Moët Hennessy', role: 'Luxury Champagne Allocation', region: 'France / Global' },
    { name: 'Distell Group', role: 'South African Cellars', region: 'Cape Town' },
    { name: 'Heineken International', role: 'Premium Lager Network', region: 'Amsterdam / Kenya' },
  ];

  const operationalStats = [
    { value: '10', label: 'Regional Depots', detail: 'Serving Eldoret, Nandi, Elgeyo Marakwet & Western' },
    { value: '150+', label: 'Authenticated SKUs', detail: '100% genuine tax-stamped direct allocations' },
    { value: '450+', label: 'Active Commercial Venues', detail: 'Hotels, resort clubs, lounges & licensed retail' },
    { value: '< 4 hrs', label: 'CBD Emergency Dispatch', detail: 'Fast weekend turnaround for peak hospitality' },
  ];

  const operationalSteps = [
    {
      step: '01',
      title: 'Commercial Onboarding & KRA Verification',
      description: 'Submit your registered entity details, KRA PIN, and County Alcoholic Drinks License. Verified within 24 hours for institutional wholesale status.',
    },
    {
      step: '02',
      title: 'Access Direct Tiered Case Pricing',
      description: 'Unlock direct wholesale rates with volume-based bulk discounts: 3% off on 5+ cases and 5% off on 10+ cases, combined with Net 14 or Net 30 payment terms.',
    },
    {
      step: '03',
      title: 'Submit Orders via Matrix or Digital Catalog',
      description: 'Use our high-speed Quick Order Pad or interactive online catalog. Place multi-case orders in seconds with zero phone friction or confusion.',
    },
    {
      step: '04',
      title: 'Guaranteed 24-Hour Direct-to-Cellar Delivery',
      description: 'Our bonded vehicle fleet dispatches from your nearest regional branch with full delivery notes, digital VAT receipts, and physical check-off.',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0c0c14] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* 1. Hero Corporate Introduction */}
      <Hero
        onExploreCatalog={() => onNavigate('catalog')}
      />

      {/* 2. Operational Metrics Ribbon */}
      <section className="border-y border-gray-200 dark:border-white/10 bg-white dark:bg-[#151524]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {operationalStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0E01B5] dark:text-[#8c82ff] font-display">
                  {stat.value}
                </div>
                <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who We Are: The Core Mission & Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E01B5]/10 text-[#0E01B5] dark:text-[#8c82ff] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              The Supply Chain Authority
            </div>
            
            <h2 className="hero-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-gray-900 dark:text-white leading-tight">
              Empowering Hospitality Excellence Through Unbroken Beverage Supply
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Founded at Jumbo House, Eldoret, <strong className="text-gray-900 dark:text-white">Bessich Distributors</strong> is Kenya’s dedicated institutional wholesaler for licensed hospitality and retail entities. We bridge the critical gap between international distilleries, premier vineyards, major breweries, and commercial venues.
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Our infrastructure is engineered specifically for commercial buyers who cannot afford counterfeit risks, sudden stock-outs on busy weekends, or erratic price fluctuations. With guaranteed digital excise stamps and climate-controlled storage, we protect your brand reputation and guest satisfaction.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-5 py-3 rounded-xl bg-[#0E01B5] hover:bg-[#0a018f] text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                Learn More About Our Story
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('branches')}
                className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F2693F]" />
                Explore 10 Regional Branches
              </button>
            </div>
          </div>

          {/* Core Pillars Bento */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#171728] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">100% Tax & KRA Compliance</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Zero grey-market imports. Every case features authenticated digital excise stamps and full ETR invoice compliance.
              </p>
            </div>

            <div className="bg-white dark:bg-[#171728] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0E01B5]/10 text-[#0E01B5] dark:text-[#8c82ff] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Dedicated Dispatch Fleet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Temperature-safe distribution trucks operating scheduled daily routes across Eldoret CBD, Nandi, and Western counties.
              </p>
            </div>

            <div className="bg-white dark:bg-[#171728] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] dark:text-[#FFD700] flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Transparent Wholesale Margins</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Published tiered pricing with built-in volume incentives that safeguard profitability for bar owners and retail merchants.
              </p>
            </div>

            <div className="bg-white dark:bg-[#171728] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F2693F]/10 text-[#F2693F] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Sommelier & Staff Training</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Free wine list curation, glassware pairing guidance, and banquet service workshops for hospitality client partners.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Portfolio Architecture: What We Distribute (No individual items) */}
      <section className="bg-gray-50 dark:bg-[#12121e] border-y border-gray-200 dark:border-white/10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E01B5] dark:text-[#8c82ff]">
                Portfolio Categories
              </span>
              <h2 className="hero-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-gray-900 dark:text-white">
                Comprehensive Beverage Collections
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                Explore our wholesale divisions. All products are stored in regulated, bonded warehouses ready for rapid case and pallet dispatch.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-[#0E01B5] hover:bg-[#0a018f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              Open Full Product Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categoryHighlights.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-[#171728] rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-[#0E01B5] dark:hover:border-[#8c82ff] transition-all hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${cat.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-[#0E01B5] dark:group-hover:text-[#8c82ff] transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-xs font-semibold text-[#D4AF37] dark:text-[#FFD700] mt-0.5">
                        {cat.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Anchor Brand Lines:
                      </span>
                      <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                        {cat.keyBrands}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onNavigate('catalog', cat.id)}
                      className="text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Browse {cat.label} in Catalog
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-gray-400 font-mono">
                      Cases & Bottles
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Order Pad CTA card */}
            <div className="bg-linear-to-br from-[#171728] to-[#0E01B5] rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#FFD700]">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg">High-Speed Matrix Order Pad</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Managing a high-velocity bar or supermarket inventory? Input your entire case and bottle quantities in our commercial grid and submit line orders instantly.
                </p>
              </div>

              <div className="pt-6">
                {/* TODO: Admin-only - Matrix Order Pad
                <button
                  type="button"
                  onClick={onOpenMatrix}
                  className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-[#171728] py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  Launch Quick Order Pad
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                */}
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-[#171728] py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  Order from Our Catalog
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. How Commercial Ordering Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E01B5] dark:text-[#8c82ff]">
            Frictionless Procurement
          </span>
          <h2 className="hero-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-gray-900 dark:text-white">
            How Wholesale Distribution Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            A seamless, professional onboarding and ordering pipeline designed to keep your taps flowing and cellars filled.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {operationalSteps.map((stepItem, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-[#171728] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs relative flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-3xl font-black text-[#0E01B5]/20 dark:text-white/20 font-display block mb-2">
                  {stepItem.step}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {stepItem.description}
                </p>
              </div>
              <div className="h-1 w-12 bg-[#0E01B5] dark:bg-[#8c82ff] rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* 6. Authorized Brand Houses & Producers */}
      <section className="bg-white dark:bg-[#151524] border-y border-gray-200 dark:border-white/10 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
              Authorized Brand Alliances
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
              Official Importers & National Bottlers
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {brandPartners.map((bp, idx) => (
              <div 
                key={idx}
                className="bg-gray-50 dark:bg-[#1c1c30] p-4 rounded-xl border border-gray-100 dark:border-white/5 text-center flex flex-col justify-center items-center gap-1 hover:border-[#0E01B5]/40 transition-colors"
              >
                <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">
                  {bp.name}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  {bp.role}
                </span>
                <span className="text-[9px] font-mono text-[#0E01B5] dark:text-[#8c82ff]">
                  {bp.region}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Commercial Client Endorsements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] dark:text-[#FFD700]">
            Partners in Hospitality
          </span>
          <h2 className="hero-heading text-2xl sm:text-3xl font-extrabold font-display text-gray-900 dark:text-white">
            Trusted by the Rift Valley’s Leading Venues
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-[#171728] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#FFD700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700]" />
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
              "Bessich has transformed our beverage operations at Rupa Mall. Their weekend emergency dispatch saved our lounge during peak festive nights, and having genuine KRA stamps gives our guests 100% confidence."
            </p>
            <div className="border-t border-gray-100 dark:border-white/10 pt-3">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">Brian K.</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Beverage Manager, The Loft Lounge & Grill (Eldoret)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171728] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#FFD700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700]" />
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
              "As a retail liquor merchant in town, consistent wholesale pricing and 24-hour delivery from Jumbo House keep our shelves stocked without tying up all our working capital. Their Net-14 terms are unmatched."
            </p>
            <div className="border-t border-gray-100 dark:border-white/10 pt-3">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">Mercy J.</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Proprietor, Rift Valley Spirits Wholesalers</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171728] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#FFD700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700]" />
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
              "The sommelier training and wine cellar support Bessich provided for our banquet team significantly elevated our conference banquet beverage sales. A dependable corporate distribution partner."
            </p>
            <div className="border-t border-gray-100 dark:border-white/10 pt-3">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">Evans T.</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">F&B Director, Highland Grand Resort</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner: Catalog & Credit Account */}
      <section className="bg-linear-to-r from-[#171728] via-[#0E01B5] to-[#171728] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FFD700]">
            <Sparkles className="w-3.5 h-3.5" />
            Join 450+ Premier Establishments
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black font-display max-w-2xl mx-auto">
            Ready to Streamline Your Commercial Beverage Supply?
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto leading-relaxed">
            Browse our full 150+ beverage portfolio or register your licensed venue today to access wholesale credit facilities and direct depot fulfillment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#e6c200] text-[#171728] px-6 py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Wholesale Catalog
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* TODO: Admin-only - Trade Credit Application
            <button
              type="button"
              onClick={onOpenCreditModal}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#FFD700]" />
              Apply for Trade Credit Facility
            </button>
            */}

            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Order Now
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto text-gray-300 hover:text-white px-4 py-3.5 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F2693F]" />
              Speak with a Beverage Executive
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
