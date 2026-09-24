import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Percent, 
  ArrowRight
} from 'lucide-react';

// PUBLIC MODE: B2B account card, credit buttons, and stats commented out for admin-only restoration later

interface HeroProps {
  onExploreCatalog: () => void;
  // onOpenMatrix: () => void;          // TODO: Admin-only - matrix order pad
  // onOpenCreditModal: () => void;     // TODO: Admin-only - credit application
  // b2bProfile: B2BProfile;            // TODO: Admin-only - account status
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  // onOpenMatrix,        // TODO: Admin-only
  // onOpenCreditModal,   // TODO: Admin-only
  // b2bProfile,          // TODO: Admin-only
}) => {
  return (
    <div className="relative bg-[#171728] text-white overflow-hidden border-b border-white/10">
      {/* Subtle brand glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0E01B5]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0E01B5]/40 border border-[#0E01B5] text-[11px] sm:text-xs font-semibold text-[#FFD700]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Official Wholesale Catalog • 2026 Pricing
            </div>

            <h1 className="hero-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Elevating the Beverage <br />
              <span className="text-[#FFD700]">Experience in Kenya</span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-[#F5F5DC]/80 max-w-2xl leading-relaxed font-sans">
              Bessich Distributors is the premier licensed supply chain partner connecting world-class wines, 
              single malt whiskies, premium spirits, and craft beers with leading hotels, lounges, 
              restaurants, and retail stores across Eldoret, the Rift Valley, and Western Kenya.
            </p>

            {/* Value Props Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[#FAF9F6] bg-white/5 border border-white/10 rounded-lg p-2.5">
                <ShieldCheck className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span>100% Genuine KRA Stamped</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#FAF9F6] bg-white/5 border border-white/10 rounded-lg p-2.5">
                <Truck className="w-4 h-4 text-[#F2693F] shrink-0" />
                <span>10 Regional Depots (24H Dispatch)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#FAF9F6] bg-white/5 border border-white/10 rounded-lg p-2.5">
                <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tiered Case Wholesale Rates</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                id="hero-btn-explore"
                type="button"
                onClick={onExploreCatalog}
                className="w-full sm:w-auto bg-[#0E01B5] hover:bg-[#0a018f] text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Browse Full Catalog
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreCatalog}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Start Your Order
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* TODO: Admin-only - Matrix Order Pad & Credit Application
              <button
                type="button"
                onClick={onOpenMatrix}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#FAF9F6] border border-white/20 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                Quick Matrix Order Pad
              </button>

              {!b2bProfile.isVerified && (
                <button
                  type="button"
                  onClick={onOpenCreditModal}
                  className="w-full sm:w-auto text-xs text-[#FFD700] hover:underline flex items-center justify-center sm:justify-start gap-1 font-semibold py-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Apply for Net-30 Trade Credit →
                </button>
              )}
              */}
            </div>
          </div>

          {/* Right Hero - Outlet Info Card (replaces B2B Account Card) */}
          <div className="lg:col-span-5">
            <div className="bg-[#1f1f35]/90 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl relative backdrop-blur-xs">
              <div className="border-b border-white/10 pb-3 mb-3">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4AF37]">
                  Bessich Wholesale Supply
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white mt-1">
                  Direct from Bessich Distributors
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Eldoret, Rift Valley &amp; Nationwide</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">Catalog Source:</span>
                  <span className="font-semibold text-[#FFD700]">Live E-Commerce Inventory</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">Product Range:</span>
                  <span className="font-semibold text-[#FAF9F6]">220+ Premium SKUs</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">Categories:</span>
                  <span className="font-semibold text-[#FAF9F6]">Spirits, Beer, Wine</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">Coverage:</span>
                  <span className="font-semibold text-emerald-400">Eldoret & Western Kenya</span>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#F2693F]" /> Same-day dispatch available
                </span>
                <span className="text-[#FFD700] font-medium">Free delivery &gt; KES 30k</span>
              </div>
            </div>

            {/* TODO: Admin-only - B2B Account Status Card
            <div className="bg-[#1f1f35]/90 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl relative backdrop-blur-xs">
              ... (B2B account card with KRA PIN, credit limits, etc.)
            </div>
            */}
          </div>

        </div>
      </div>
    </div>
  );
};
