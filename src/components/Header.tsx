import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown,
  Home,
  Info,
  Layers,
  BookOpen,
  PhoneCall,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Depot, ActivePage } from '../types';
import { ThemeToggle } from './ThemeToggle';

// PUBLIC MODE: Cart, B2B tools, profile switcher, and credit badges commented out for admin-only restoration later

interface HeaderProps {
  activeDepot: Depot;
  allDepots: Depot[];
  onSelectDepot: (depot: Depot) => void;
  activeTab: ActivePage;
  setActiveTab: (tab: ActivePage) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  // TODO: Admin-only props
  // b2bProfile: B2BProfile;
  // availableProfiles: B2BProfile[];
  // onSwitchProfile: (profile: B2BProfile) => void;
  // cartItems: CartItem[];
  // onOpenCart: () => void;
  // onOpenApplyCredit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDepot,
  allDepots,
  onSelectDepot,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [depotDropdownOpen, setDepotDropdownOpen] = useState(false);

  const navLinks: { id: ActivePage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About us', icon: Info },
    { id: 'catalog', label: 'Catalog', icon: BookOpen },
    { id: 'branches', label: 'Branches', icon: MapPin },
    { id: 'pricelist', label: 'Price List', icon: Layers },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActiveTab(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val && activeTab !== 'catalog') {
      setActiveTab('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#12121e] border-b border-[#171728]/10 dark:border-white/10 shadow-xs transition-colors duration-200">
      
      {/* 1. Top Corporate Utility Bar */}
      <div className="bg-[#171728] text-[#F5F5DC] text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-[#FFD700]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
              Official Kenya Licensed Liquor & Wine Wholesale Distributor
            </span>
            <span className="hidden md:inline-block text-white/30">|</span>
            <a 
              href="tel:+254754320000" 
              className="hidden sm:flex items-center gap-1.5 text-[#F5F5DC] hover:text-white transition-colors font-semibold"
            >
              <Phone className="w-3 h-3 text-[#F2693F]" />
              Wholesale Hotline: +254 754 320 000
            </a>
            <span className="hidden lg:inline-block text-white/30">|</span>
            <span className="hidden lg:inline-block text-white/70">
              HQ: Jumbo House, Iten Rd, Opp. Fire Station, Eldoret
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Depot Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDepotDropdownOpen(!depotDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#23233a] hover:bg-[#2c2c47] text-[#FAF9F6] px-2.5 py-1 rounded-md transition-colors border border-white/10 cursor-pointer"
                title="Change active fulfillment branch"
              >
                <MapPin className="w-3 h-3 text-[#F2693F]" />
                <span className="truncate max-w-[130px] sm:max-w-[180px] text-[11px] font-medium">
                  {activeDepot.name}
                </span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              {depotDropdownOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white dark:bg-[#1b1b2d] text-[#171728] dark:text-[#FAF9F6] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span>Select Dispatch Branch</span>
                    <span className="text-[10px] text-[#0E01B5] dark:text-[#8c82ff]">10 Hubs</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {allDepots.map((depot) => (
                      <button
                        key={depot.id}
                        type="button"
                        onClick={() => {
                          onSelectDepot(depot);
                          setDepotDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-[#F5F5DC]/50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                          depot.id === activeDepot.id ? 'bg-[#0E01B5]/10 dark:bg-[#0E01B5]/25 border-l-3 border-[#0E01B5]' : ''
                        }`}
                      >
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                          {depot.name}
                          {depot.isCentralHub && (
                            <span className="bg-[#0E01B5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Central HQ</span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{depot.region}</span>
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-gray-800 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('branches');
                        setDepotDropdownOpen(false);
                      }}
                      className="text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] hover:underline cursor-pointer"
                    >
                      View All Branch Details & Schedules →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order on The Bar Kenya */}
            <a
              href="https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Order Now
            </a>

            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} variant="compact" />
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1b1b2d] p-1 flex items-center justify-center border border-gray-200 dark:border-gray-700 group-hover:border-[#0E01B5] transition-colors shadow-xs">
              <img 
                src="/bessich-logo.png" 
                alt="Bessich Distributors Crest" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="bg-[#0E01B5] text-white w-full h-full rounded flex items-center justify-center font-bold text-lg">BD</div>`;
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-[#0E01B5] dark:text-[#8c82ff] group-hover:text-[#09007A] dark:group-hover:text-[#a59dff] transition-colors font-display">
                  BESSICH
                </span>
                <span className="text-[11px] uppercase font-black tracking-wider text-[#D4AF37] px-1.5 py-0.5 rounded bg-[#171728]">
                  Distributors
                </span>
              </div>
              <p className="text-[11px] text-[#686781] dark:text-gray-400 hidden sm:block font-medium">
                Elevating the Beverage Experience
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search wine, whisky, gin, beer, SKU..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FAF9F6] dark:bg-[#1b1b2d] text-gray-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0E01B5] dark:focus:ring-[#8c82ff] focus:border-transparent transition-all shadow-2xs placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Nav + Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0E01B5] text-white shadow-xs'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#171728] border-t border-gray-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search wine, whisky, gin, beer..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#23233a] text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0E01B5] text-white'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}

            {/* Order Now - External Link */}
            <a
              href="https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-emerald-600 text-white"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Order on The Bar Kenya</span>
            </a>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
            <a
              href="tel:+254754320000"
              className="flex items-center gap-1.5 font-bold text-[#0E01B5] dark:text-[#8c82ff]"
            >
              <Phone className="w-3.5 h-3.5" />
              +254 754 320 000
            </a>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} variant="compact" />
          </div>
        </div>
      )}

      {/* TODO: Admin-only - B2B Tools Dropdown, Profile Switcher, Cart Button, Credit Badge */}
    </header>
  );
};
