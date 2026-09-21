import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  Printer, 
  RefreshCw,
  Truck,
  DollarSign,
  Package,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { B2BProfile, B2BOrder, Product, CatalogSyncStatus } from '../types';
import { formatKes } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

interface B2BPortalSectionProps {
  b2bProfile: B2BProfile;
  availableProfiles: B2BProfile[];
  onSwitchProfile: (profile: B2BProfile) => void;
  orders: B2BOrder[];
  products: Product[];
  onOpenCreditModal: () => void;
  onReorder: (order: B2BOrder) => void;
  onViewInvoice: (order: B2BOrder) => void;
  onNavigateToPricelist: () => void;
  syncStatus?: CatalogSyncStatus;
  onManualSync?: () => void;
}

export const B2BPortalSection: React.FC<B2BPortalSectionProps> = ({
  b2bProfile,
  availableProfiles,
  onSwitchProfile,
  orders,
  products,
  onOpenCreditModal,
  onReorder,
  onViewInvoice,
  onNavigateToPricelist,
  syncStatus,
  onManualSync,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'credit' | 'compliance'>('profile');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top B2B Banner */}
      <div className="bg-[#171728] text-white p-5 sm:p-7 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#0E01B5] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              B2B Commercial Desk
            </span>
            {b2bProfile.isVerified ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                KRA & Liquor Board Certified
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Unverified Profile
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display">
            {b2bProfile.businessName}
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5DC]/80 max-w-xl">
            Account ID: <span className="font-mono text-white">{b2bProfile.id}</span> • Registered {b2bProfile.businessType} • Primary Hub: {b2bProfile.primaryDepot}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {!b2bProfile.isVerified && (
            <button
              type="button"
              onClick={onOpenCreditModal}
              className="bg-[#FFD700] hover:bg-[#e6c200] text-[#171728] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
            >
              Verify License & Apply for Credit
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateToPricelist}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Official Price List
          </button>
        </div>
      </div>

      {/* Credit & Operational Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Payment Terms</span>
            <Clock className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {b2bProfile.paymentTermsDays > 0 ? `Net ${b2bProfile.paymentTermsDays} Days` : 'Cash on Delivery'}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {b2bProfile.paymentTermsDays > 0 ? 'Approved Commercial Credit Facility' : 'Pay via M-PESA Till or Cheque'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Credit Line</span>
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {formatKes(b2bProfile.availableCreditKes)}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center justify-between">
            <span>Available balance</span>
            <span className="text-gray-400">Limit: {formatKes(b2bProfile.creditLimitKes)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Orders</span>
            <Package className="w-4 h-4 text-[#F2693F]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {orders.length} Wholesale Orders
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Latest: {orders[0]?.orderDate || 'Active today'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Depot Dispatch Hub</span>
            <Truck className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
          </div>
          <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
            {b2bProfile.primaryDepot}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Standard 24hr Fleet Route
          </div>
        </div>
      </div>

      {/* Real-time Website Catalog Sync Module (Option 1) */}
      {syncStatus && (
        <div className="bg-white dark:bg-[#171728] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${syncStatus.isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-ping'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${syncStatus.isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Real-Time Live Catalog Sync Active (Option 1)
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Auto-Polling & Dynamic Extraction
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                This platform is connected in real time to <a href="https://www.bessichdistributors.co.ke/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-[#0E01B5] dark:hover:text-[#8c82ff]">www.bessichdistributors.co.ke</a>. Any addition or reduction of SKUs on the main website is dynamically scraped and reflected live in your wholesale catalog, matrix order pad, and price list.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap pt-1">
                <span>Active SKUs: <strong className="text-gray-900 dark:text-white font-bold">{products.length}</strong></span>
                <span>•</span>
                <span>Active Bundle: <code className="bg-gray-100 dark:bg-black/30 px-1 py-0.5 rounded text-[10px] font-mono">{syncStatus.bundleHash || 'index-CdsTTZlQ.js'}</code></span>
                <span>•</span>
                <span>Last Synced: <strong className="text-gray-900 dark:text-white">{syncStatus.lastSyncedAt ? new Date(syncStatus.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Initial Load'}</strong></span>
              </div>
            </div>

            {onManualSync && (
              <button
                type="button"
                onClick={onManualSync}
                disabled={syncStatus.isSyncing}
                className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                <span>{syncStatus.isSyncing ? 'Synchronizing Catalog...' : 'Sync Catalog Now'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-gray-200 dark:border-gray-800 text-xs font-bold gap-4 sm:gap-6 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#0E01B5] dark:border-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Business Credentials & KRA
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-[#0E01B5] dark:border-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Orders & Dispatch Status
          <span className="bg-gray-100 dark:bg-[#25253d] text-gray-700 dark:text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('credit')}
          className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'credit'
              ? 'border-[#0E01B5] dark:border-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Trade Credit Facilities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'compliance'
              ? 'border-[#0E01B5] dark:border-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Licensing & Compliance
        </button>
      </div>

      {/* Tab 1: Business Profile & Credentials */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-white dark:bg-[#171728] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                Registered Commercial Entity Profile
              </h3>
              <span className="text-[11px] text-gray-400">
                Managed via Bessich Eldoret HQ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">Business / Trade Name</label>
                <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{b2bProfile.businessName}</div>
              </div>

              <div>
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">Industry Classification</label>
                <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{b2bProfile.businessType}</div>
              </div>

              <div>
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">Kenya Revenue Authority (KRA) PIN</label>
                <div className="font-mono font-bold text-[#0E01B5] dark:text-[#8c82ff] mt-0.5">{b2bProfile.kraPin}</div>
              </div>

              <div>
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">County Liquor Licensing Board (CLLB) #</label>
                <div className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">{b2bProfile.liquorLicenseNumber}</div>
              </div>

              <div>
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">Authorised Purchasing Contact</label>
                <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{b2bProfile.contactPerson}</div>
              </div>

              <div>
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">Direct Telephone & WhatsApp</label>
                <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{b2bProfile.phoneNumber}</div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-500 dark:text-gray-400 block text-[11px] font-medium">Primary Receiving & Delivery Address</label>
                <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{b2bProfile.deliveryAddress}</div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Official Distributor Invoicing Guarantee</div>
                <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                  All shipments from Bessich Distributors come accompanied by official Electronic Tax Invoices (ETR) with verified KRA QR codes and batch stamp tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Account Profile Switcher (Demo Simulator) */}
          <div className="md:col-span-4 bg-white dark:bg-[#171728] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              Account Simulation Switcher
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select one of the pre-configured accounts below to test different discount tiers, credit terms, and checkout capabilities:
            </p>

            <div className="space-y-2.5">
              {availableProfiles.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => onSwitchProfile(prof)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    prof.id === b2bProfile.id
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#25253d]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                    <span className="truncate max-w-[170px]">{prof.businessName}</span>
                    {prof.tier === 'premium_hospitality' && (
                      <span className="bg-[#FFD700] text-[#171728] text-[9px] px-1.5 py-0.5 rounded font-extrabold">
                        Tier 1 (Net 30)
                      </span>
                    )}
                    {prof.tier === 'licensed_retailer' && (
                      <span className="bg-[#0E01B5] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                        Tier 2 (Net 14)
                      </span>
                    )}
                    {prof.tier === 'guest' && (
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[9px] px-1.5 py-0.5 rounded font-medium">
                        Guest
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {prof.businessType} • {prof.isVerified ? `Limit ${formatKes(prof.creditLimitKes)}` : 'Cash on Delivery'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Dispatch History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Wholesale Order History & Invoices
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing recent dispatches
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((order) => (
                <div key={order.id} className="p-5 space-y-4 hover:bg-gray-50/50 dark:hover:bg-[#1f1f35] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white font-mono">
                          {order.id}
                        </span>
                        {order.poNumber && (
                          <span className="text-xs bg-gray-100 dark:bg-[#25253d] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                            PO: {order.poNumber}
                          </span>
                        )}
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : order.status === 'Dispatched'
                            ? 'bg-blue-100 dark:bg-blue-950/70 text-[#0E01B5] dark:text-[#8c82ff]'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3">
                        <span>Ordered: {order.orderDate}</span>
                        <span>•</span>
                        <span>Fulfillment: {order.depotName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Net</div>
                        <div className="font-extrabold text-sm sm:text-base text-[#0E01B5] dark:text-[#8c82ff]">
                          {formatKes(order.totalKes)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewInvoice(order)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-[#25253d] hover:bg-gray-200 dark:hover:bg-[#30304e] text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Invoice
                        </button>
                        <button
                          type="button"
                          onClick={() => onReorder(order)}
                          className="px-3 py-1.5 bg-[#0E01B5] hover:bg-[#09007A] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reorder
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Itemized lines preview */}
                  <div className="bg-[#FAF9F6] dark:bg-[#12121e] p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-xs">
                    <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Consignment Items ({order.items.length} line{order.items.length > 1 ? 's' : ''}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white dark:bg-[#1b1b2d] p-2 rounded border border-gray-100 dark:border-gray-800">
                          <img 
                            src={getProductImageUrl(item.product.image)} 
                            alt={item.product.name} 
                            className="w-7 h-7 object-contain bg-gray-50 dark:bg-[#25253d] rounded"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, item.product.fallbackImage)}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white truncate text-[11px]">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              {item.quantity} {item.orderType}{item.quantity > 1 ? 's' : ''} • {item.product.casePack} btls/case
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Trade Credit Facilities */}
      {activeTab === 'credit' && (
        <div className="bg-white dark:bg-[#171728] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                B2B Trade Credit Account Facility
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Revolving credit line for licensed hotels, clubs, and high-volume distributors in Kenya.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCreditModal}
              className="bg-[#0E01B5] hover:bg-[#09007A] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              Request Credit Limit Increase
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase block">Approved Credit Ceiling</span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatKes(b2bProfile.creditLimitKes)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Underwritten by Bessich Finance Desk</div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase block">Available Drawing Balance</span>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{formatKes(b2bProfile.availableCreditKes)}</div>
              <div className="text-xs text-emerald-800 dark:text-emerald-300">Immediately usable at checkout</div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase block">Settlement Period</span>
              <div className="text-2xl font-extrabold text-[#0E01B5] dark:text-[#8c82ff]">
                {b2bProfile.paymentTermsDays > 0 ? `${b2bProfile.paymentTermsDays} Calendar Days` : 'Cash on Delivery'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Invoice due date calculation</div>
            </div>
          </div>

          {/* Credit Terms Explanation */}
          <div className="p-4 bg-[#F5F5DC]/40 dark:bg-[#1b1b2d] rounded-xl border border-[#F5F5DC] dark:border-gray-700 text-xs space-y-2 text-gray-700 dark:text-gray-300">
            <h4 className="font-bold text-[#171728] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" /> Commercial Terms & Settlement Guidelines
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-[11px]">
              <li>Credit facility applies exclusively to case-level wholesale orders dispatched to the registered physical premise.</li>
              <li>Settlements are accepted via Absa Bank Kenya RTGS, KCB Commercial Eldoret, or Bessich Lipa na M-PESA Paybill (891200).</li>
              <li>Monthly statements are generated automatically on the 1st of each calendar month.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Licensing & Compliance */}
      {activeTab === 'compliance' && (
        <div className="bg-white dark:bg-[#171728] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Kenya Alcohol & Beverages Statutory Compliance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bessich Distributors strictly complies with National and County Alcoholic Drinks Control Acts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                KRA Digital Excise Stamp Verification
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                Every bottle and case supplied by Bessich features genuine, unscratched KRA digital tax stamps traceable via the KRA Soma Label app.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Licensed Wholesale Distributor
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                Fully authorized under County Government of Uasin Gishu Alcoholic Drinks Licensing Board to wholesale across the Rift Valley and Western Kenya.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
