import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Truck, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FileCheck, 
  MapPin, 
  ArrowRight,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { ActivePage } from '../types';

interface AboutSectionProps {
  onNavigate: (page: ActivePage) => void;
  // TODO: Admin-only — onOpenCreditModal
  // onOpenCreditModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  onNavigate,
  // onOpenCreditModal // TODO: Admin-only
}) => {
  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0c0c14] text-gray-900 dark:text-gray-100 min-h-screen py-6 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        {/* Hero Banner for About Us */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#171728] text-white p-5 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E01B5]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0E01B5]/40 border border-[#0E01B5] text-[11px] sm:text-xs font-semibold text-[#FFD700]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Founded in Eldoret, Kenya • Certified Wholesale Distributor</span>
            </div>

            <h1 className="hero-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
              Elevating the Beverage <br />
              <span className="text-[#FFD700]">Experience in Kenya</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Bessich Distributors Limited is Kenya's premier licensed supply chain partner, specializing in the wholesale distribution of world-class wines, single malt whiskies, premium spirits, and craft beers. Headquartered at Jumbo House along Iten Road in Eldoret, we anchor the hospitality and retail beverage supply across the North Rift, Western Kenya, and beyond.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto bg-[#0E01B5] hover:bg-[#0a018f] text-white px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Browse Our Portfolio
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('branches')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#F2693F]" />
                Explore 10 Regional Branches
              </button>
            </div>
          </div>
        </div>

        {/* Corporate Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0E01B5] dark:text-[#8c82ff] block mb-0.5 font-display">
              10+
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Regional Branches
            </span>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Eldoret HQ & North Rift</p>
          </div>

          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] dark:text-[#FFD700] block mb-0.5 font-display">
              100%
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              KRA Tax Compliant
            </span>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Verified brand principals</p>
          </div>

          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block mb-0.5 font-display">
              &lt; 24H
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Dispatch Guarantee
            </span>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Fleet across 6 counties</p>
          </div>

          <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F2693F] block mb-0.5 font-display">
              450+
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Commercial Partners
            </span>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Hotels, lounges & retail</p>
          </div>
        </div>

        {/* Our Mission, Vision & Heritage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#0E01B5]/10 dark:bg-[#0E01B5]/30 text-[#0E01B5] dark:text-[#8c82ff] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                Our Heritage & Mission
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded with a vision to eliminate supply chain disruptions and counterfeit stock in Kenya's beverage sector, Bessich Distributors was established to provide licensed establishments with an uncompromising source of genuine wines, spirits, and beers.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Our mission is to empower hoteliers, restaurateurs, bar managers, and retailers by delivering pristine temperature-controlled beverages, fair tiered pricing, structured revolving trade credit, and dependable logistics directly to their doorsteps.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/10 mt-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">
                Licensed under Kenya Alcoholic Drinks Control Act & Uasin Gishu County Liquor Board
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171728] rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFD700]/15 text-[#D4AF37] dark:text-[#FFD700] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                Our Core Commitments
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E01B5] dark:bg-[#8c82ff] mt-2 shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Zero Counterfeit Tolerance:</strong> Every bottle bears authenticated KRA digital excise tax stamps.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E01B5] dark:bg-[#8c82ff] mt-2 shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Climate-Controlled Warehousing:</strong> Regulated cellars preserving delicate wine vintages and fine single malts.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E01B5] dark:bg-[#8c82ff] mt-2 shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Structured Commercial Terms:</strong> 14-day and 30-day revolving credit facilities for licensed trade.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E01B5] dark:bg-[#8c82ff] mt-2 shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Strict Statutory Age Verification:</strong> Ethical distribution adhering strictly to 18+ legal drinking age.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/10 mt-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">
                Direct authorized importer agreements with global brand houses
              </span>
            </div>
          </div>
        </div>

        {/* Logistics & Warehousing Advantage */}
        <div className="bg-[#171728] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-[#FFD700] block">
              Supply Chain & Infrastructure
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display">
              The Bessich Logistics Backbone
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              From our flagship Jumbo House central hub in Eldoret to 9 secondary distribution hubs across the region, we operate a dedicated fleet of insulated transport vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="bg-[#23233a] p-4 sm:p-5 rounded-xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#0E01B5] text-white flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white">Direct Distribution Fleet</h4>
              <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
                Over 25 dedicated delivery vans and heavy haul trucks operating scheduled daily runs across Eldoret CBD, Kimumu, Langas, Kapsowar, Nandi Hills, Burnt Forest, Kesses, and Turbo.
              </p>
            </div>

            <div className="bg-[#23233a] p-4 sm:p-5 rounded-xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white">Automated B2B Portals</h4>
              <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
                Our digital ordering platform enables real-time pallet assembly, live pro-forma invoicing, official KRA tax invoices, and instant M-PESA Till / B2B Paybill reconciliation.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Call to Action */}
        <div className="bg-linear-to-r from-[#0E01B5] to-[#171728] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-display">
              Ready to Upgrade Your Establishment's Beverage Supply?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Open a verified commercial trade account today. Benefit from guaranteed KRA stamps, dependable branch fulfillment, and commercial delivery straight to your cellar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            {/* TODO: Admin-only - Credit Application
            <button
              type="button"
              onClick={onOpenCreditModal}
              className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#F2C200] text-[#171728] px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer text-center"
            >
              Apply for B2B Trade Credit
            </button>
            */}
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#F2C200] text-[#171728] px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer text-center"
            >
              Order from Our Catalog
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer text-center"
            >
              Contact Our Sales Team
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
