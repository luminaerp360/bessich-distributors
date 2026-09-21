import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Search, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  UserCheck, 
  Menu, 
  X,
  FileSpreadsheet,
  Grid3X3,
  ChevronDown,
  Home,
  Info,
  Layers,
  BookOpen,
  PhoneCall,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Radio
} from 'lucide-react';
import { B2BProfile, CartItem, Depot, ActivePage, CatalogSyncStatus } from '../types';
import { formatKes } from '../utils/formatters';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeDepot: Depot;
  allDepots: Depot[];
  onSelectDepot: (depot: Depot) => void;
  b2bProfile: B2BProfile;
  availableProfiles: B2BProfile[];
  onSwitchProfile: (profile: B2BProfile) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  activeTab: ActivePage;
  setActiveTab: (tab: ActivePage) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenApplyCredit: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  syncStatus?: CatalogSyncStatus;
  onManualSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDepot,
  allDepots,
  onSelectDepot,
  b2bProfile,
  availableProfiles,
  onSwitchProfile,
  cartItems,
  onOpenCart,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenApplyCredit,
  isDark,
  onToggleTheme,
  syncStatus,
  onManualSync,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [depotDropdownOpen, setDepotDropdownOpen] = useState(false);
  const [b2bToolsDropdownOpen, setB2bToolsDropdownOpen] = useState(false);

  // Calculate cart counts and total
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalEstimatedCost = cartItems.reduce((acc, item) => {
    const price = item.orderType === 'case' ? item.product.casePriceKes : item.product.bottlePriceKes;
    return acc + price * item.quantity;
  }, 0);

  const navLinks: { id: ActivePage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About us', icon: Info },
    { id: 'catalog', label: 'Catalog', icon: BookOpen },
    { id: 'branches', label: 'Branches', icon: MapPin },
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
          
          {/* Left: Certifications & Contact Hotline */}
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

          {/* Right: Live Sync, Branch Selector, B2B Credit Badge & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Live Website Catalog Real-Time Sync Indicator */}
            {syncStatus && (
              <button
                type="button"
                onClick={onManualSync}
                disabled={syncStatus.isSyncing}
                title={`Live sync with Cyden General Enterprises / The Bar Kenya: ${syncStatus.itemCount} active products. Click to refresh.`}
                className="flex items-center gap-1.5 bg-[#23233a] hover:bg-[#2c2c47] text-[#FAF9F6] px-2 sm:px-2.5 py-1 rounded-md transition-colors border border-emerald-500/40 cursor-pointer text-[11px]"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${syncStatus.isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-ping'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${syncStatus.isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                <span className="hidden md:inline font-medium text-emerald-300">
                  {syncStatus.isSyncing ? 'Syncing...' : `Live Sync (${syncStatus.itemCount})`}
                </span>
                <span className="md:hidden font-medium text-emerald-300">Live</span>
                <RefreshCw className={`w-2.5 h-2.5 text-emerald-400 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Active Branch / Depot Selector */}
            <div className="relative">
              <button
                id="btn-branch-selector"
                type="button"
                onClick={() => {
                  setDepotDropdownOpen(!depotDropdownOpen);
                  setProfileDropdownOpen(false);
                  setB2bToolsDropdownOpen(false);
                }}
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

            {/* Quick Credit Info Badge */}
            {b2bProfile.isVerified ? (
              <span className="hidden md:flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                <UserCheck className="w-3 h-3" />
                Verified B2B • {b2bProfile.paymentTermsDays}D Terms
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenApplyCredit}
                className="hidden md:flex items-center gap-1 bg-[#F2693F]/20 text-[#F2693F] border border-[#F2693F]/40 hover:bg-[#F2693F]/30 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
              >
                Apply for B2B Credit
              </button>
            )}

            {/* Top Right Dark/Light Mode Switcher */}
            <ThemeToggle 
              isDark={isDark} 
              onToggle={onToggleTheme} 
              variant="compact"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Corporate Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Crest */}
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

        {/* Center: Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="input-catalog-search"
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

        {/* Right: Primary Navigation Pages + B2B Tools + Cart + Account */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Desktop Primary Nav: Home | About us | Catalog | Branches | Contact */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}-btn`}
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

            {/* B2B Wholesale Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setB2bToolsDropdownOpen(!b2bToolsDropdownOpen);
                  setProfileDropdownOpen(false);
                  setDepotDropdownOpen(false);
                }}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'matrix' || activeTab === 'portal' || activeTab === 'pricelist'
                    ? 'bg-[#171728] text-[#FFD700] border border-white/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <span>B2B Tools</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {b2bToolsDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#1b1b2d] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('matrix');
                      setB2bToolsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer ${
                      activeTab === 'matrix' ? 'text-[#0E01B5] dark:text-[#8c82ff] bg-gray-50 dark:bg-white/5' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 text-[#F2693F]" />
                    <span>Quick Matrix Order Pad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('portal');
                      setB2bToolsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer ${
                      activeTab === 'portal' ? 'text-[#0E01B5] dark:text-[#8c82ff] bg-gray-50 dark:bg-white/5' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Commercial Portal & Orders</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('pricelist');
                      setB2bToolsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer ${
                      activeTab === 'pricelist' ? 'text-[#0E01B5] dark:text-[#8c82ff] bg-gray-50 dark:bg-white/5' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Wholesale Price List (PDF/XLS)</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Account Profile Switcher */}
          <div className="relative">
            <button
              id="btn-profile-dropdown"
              type="button"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setDepotDropdownOpen(false);
                setB2bToolsDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#0E01B5] dark:hover:border-[#8c82ff] transition-colors text-left cursor-pointer bg-[#FAF9F6] dark:bg-[#1b1b2d]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0E01B5] text-white flex items-center justify-center font-bold text-xs">
                {b2bProfile.businessName.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[130px]">
                  {b2bProfile.businessName}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {b2bProfile.isVerified ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified B2B</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">Guest</span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    Active Commercial Account
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate mt-0.5">
                    {b2bProfile.businessName}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    PIN: {b2bProfile.kraPin}
                  </div>
                  {b2bProfile.isVerified && (
                    <div className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                      <span>Available Credit:</span>
                      <span>KES {b2bProfile.availableCreditKes.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Switch Hospitality Profile
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {availableProfiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSwitchProfile(p);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex flex-col hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${
                        p.id === b2bProfile.id ? 'bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 font-bold text-[#0E01B5] dark:text-[#8c82ff]' : ''
                      }`}
                    >
                      <span className="font-semibold">{p.businessName}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{p.businessType}</span>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('portal');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-center py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Account & Invoices
                  </button>
                  {!b2bProfile.isVerified && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenApplyCredit();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-center py-2 rounded-xl bg-[#0E01B5] text-white hover:bg-[#09007A] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply for B2B Trade Credit
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Button with Live Badge */}
          <button
            id="btn-cart-drawer"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#0E01B5] hover:bg-[#09007A] text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFD700] text-[#171728] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block">Cart</span>
            {totalEstimatedCost > 0 && (
              <span className="hidden xl:inline-block pl-1 border-l border-white/30 text-[11px] font-mono text-[#FFD700]">
                {formatKes(totalEstimatedCost)}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Button */}
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

      {/* 3. Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#171728] border-t border-gray-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          
          {/* Mobile Search Bar */}
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

          {/* Mobile Nav Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3">
              Navigation Pages
            </span>
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
          </div>

          {/* B2B Wholesale Tools in Mobile */}
          <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3">
              B2B Commercial Tools
            </span>
            <button
              type="button"
              onClick={() => handleNavClick('matrix')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'matrix' ? 'bg-[#0E01B5] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <Grid3X3 className="w-4 h-4 text-[#F2693F]" />
              <span>Quick Matrix Order Pad</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('portal')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'portal' ? 'bg-[#0E01B5] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>B2B Portal & Past Invoices</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('pricelist')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'pricelist' ? 'bg-[#0E01B5] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>2026 Wholesale Price List</span>
            </button>
          </div>

          {/* Mobile Real-time Catalog Sync Card */}
          {syncStatus && (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1b1b2d] border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${syncStatus.isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-ping'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${syncStatus.isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block text-[11px]">
                    Live Website Sync
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
                    {syncStatus.isSyncing ? 'Synchronizing with live catalog...' : `${syncStatus.itemCount} SKUs synchronized`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onManualSync}
                disabled={syncStatus.isSyncing}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          )}

          {/* Mobile Hotlines & Theme */}
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

    </header>
  );
};
