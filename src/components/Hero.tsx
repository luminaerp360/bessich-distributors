import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Percent, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  BadgeAlert
} from 'lucide-react';
import { B2BProfile } from '../types';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenMatrix: () => void;
  onOpenCreditModal: () => void;
  b2bProfile: B2BProfile;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenMatrix,
  onOpenCreditModal,
  b2bProfile,
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
              B2B Wholesale Portal Active • 2026 Direct Pricing
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
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
                id="hero-btn-matrix"
                type="button"
                onClick={onOpenMatrix}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#FAF9F6] border border-white/20 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                Quick Matrix Order Pad
              </button>

              {!b2bProfile.isVerified && (
                <button
                  id="hero-btn-apply-credit"
                  type="button"
                  onClick={onOpenCreditModal}
                  className="w-full sm:w-auto text-xs text-[#FFD700] hover:underline flex items-center justify-center sm:justify-start gap-1 font-semibold py-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Apply for Net-30 Trade Credit →
                </button>
              )}
            </div>
          </div>

          {/* Right Hero B2B Account Status Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#1f1f35]/90 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl relative backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4AF37]">
                    B2B Commercial Account Status
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-white truncate max-w-[220px] sm:max-w-[260px]">
                    {b2bProfile.businessName}
                  </h3>
                </div>
                {b2bProfile.isVerified ? (
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <BadgeAlert className="w-3.5 h-3.5" />
                    Pending PIN
                  </span>
                )}
              </div>

              {/* Account Data Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">Business Sector:</span>
                  <span className="font-semibold text-[#FAF9F6]">{b2bProfile.businessType}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">KRA PIN Status:</span>
                  <span className="font-mono text-[#FFD700] font-medium">{b2bProfile.kraPin}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">County Liquor License:</span>
                  <span className="font-mono text-gray-300 truncate max-w-[150px]">{b2bProfile.liquorLicenseNumber}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-gray-400">Approved Payment Terms:</span>
                  <span className="font-semibold text-emerald-400">
                    {b2bProfile.paymentTermsDays > 0 ? `Net ${b2bProfile.paymentTermsDays} Days Revolving` : 'Cash on Delivery / M-PESA'}
                  </span>
                </div>
                {b2bProfile.isVerified && (
                  <div className="flex justify-between py-0.5 border-b border-white/5">
                    <span className="text-gray-400">Available Credit Line:</span>
                    <span className="font-bold text-[#FFD700] text-sm">
                      KES {b2bProfile.availableCreditKes.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Quick Benefits */}
              <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#F2693F]" /> Next Dispatch: Tomorrow 08:00
                </span>
                <span className="text-[#FFD700] font-medium">Free shipping &gt; KES 30k</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
