import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Wine, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { DEPOTS } from '../data/depots';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigateTab: (tab: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-[#171728] text-white border-t border-white/10 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center">
                <img
                  src="/bessich-logo.png"
                  alt="Bessich Distributors"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white font-display block">
                  BESSICH DISTRIBUTORS
                </span>
                <span className="text-[10px] text-[#FFD700] uppercase tracking-widest font-bold block">
                  Liquor & Wine Wholesale Portal
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F5F5DC]/80 leading-relaxed max-w-sm">
              Premier certified distributor and direct importer of authenticated wines, premium whiskies, spirits, and beers. Serving licensed clubs, hotels, lounges, and retailers throughout Eldoret and Western Kenya with ten regional fulfillment depots.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% KRA Stamp Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#F2693F]" />
                Direct Fleet Transport
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">
              Company & Pages
            </h4>
            <ul className="space-y-2 text-[#F5F5DC]/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Home
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  About Us
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('catalog')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Online Catalog
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('branches')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Branches & Hubs (10)
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('contact')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Contact Us
                  <ArrowUpRight className="w-3 h-3 text-gray-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Depots List preview */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">
              Distribution Hubs
            </h4>
            <ul className="space-y-1.5 text-gray-400 text-[11px]">
              <li>• Eldoret Central Jumbo House (HQ)</li>
              <li>• Town & Langas Depot</li>
              <li>• Kimumu Distribution Hub</li>
              <li>• Kapsowar Depot</li>
              <li>• Nandi Hills Logistics Hub</li>
              <li>• Burnt Forest Depot</li>
              <li>• Kesses / Lessos Hub</li>
              <li>• Sergoit, Kaiboi & Turbo Hubs</li>
            </ul>
          </div>

          {/* Contact & Eldoret Headquarters */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">
              Head Office Contact
            </h4>
            <div className="space-y-2.5 text-[#F5F5DC]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F2693F] shrink-0 mt-0.5" />
                <span>Jumbo House, Iten Road, Opp. Fire Station, Eldoret, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                <a href="tel:+254754320000" className="hover:underline font-bold text-white">
                  +254 754 320 000
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <a href="mailto:info@bessichdistributors.co.ke" className="hover:underline">
                  info@bessichdistributors.co.ke
                </a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px]">Mon-Sat: 7:30 AM - 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Age Disclaimer */}
        <div className="border-t border-white/10 pt-6 text-[11px] text-gray-400 space-y-2">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-amber-300 font-bold">
              KENYA STATUTORY NOTICE: Excessive alcohol consumption is harmful to your health. Strictly not for sale to persons under the age of 18 years.
            </div>
            <span className="font-mono text-gray-400 whitespace-nowrap text-[10px]">
              KRA EXCISE PIN: P051992014B
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <p>© {new Date().getFullYear()} Bessich Distributors Limited. All Rights Reserved. Eldoret, Kenya.</p>
            <p className="text-gray-400 text-[10px]">
              Powered by <span className="font-semibold text-[#FFD700]">Lumina</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
