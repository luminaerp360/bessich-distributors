import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  Percent,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { CartItem, Depot } from '../types';
import { formatKes, calculateItemPricing, calculateOrderTotals } from '../utils/formatters';
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateOrderType: (index: number, orderType: 'case' | 'bottle') => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
  poNumber: string;
  setPoNumber: (po: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  onGenerateQuotation: () => void;
  allDepots: Depot[];
  cartDepot: Depot;
  onSelectDepot: (depot: Depot) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateOrderType,
  onClearCart,
  onProceedCheckout,
  poNumber,
  setPoNumber,
  orderNotes,
  setOrderNotes,
  onGenerateQuotation,
  allDepots,
  cartDepot,
  onSelectDepot,
}) => {
  const [depotDropdownOpen, setDepotDropdownOpen] = React.useState(false);
  if (!isOpen) return null;

  const totals = calculateOrderTotals(cartItems);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#171728] shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-[#171728] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0E01B5] flex items-center justify-center text-white">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base font-display">
                  B2B Wholesale Order
                </h3>
                <span className="text-[11px] text-[#F5F5DC]/70">
                  {cartItems.length} SKU line{cartItems.length !== 1 ? 's' : ''} • {totals.totalCases} cases ({totals.totalBottlesEquivalent} btls total)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment Branch Selector */}
          <div className="bg-[#FAF9F6] dark:bg-[#12121e] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
              Fulfillment Branch:
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDepotDropdownOpen(!depotDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 bg-white dark:bg-[#1b1b2d] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white cursor-pointer hover:border-[#0E01B5] dark:hover:border-[#8c82ff] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#F2693F] shrink-0" />
                  <span className="truncate font-semibold">{cartDepot.name}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${depotDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {depotDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#1b1b2d] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 max-h-48 overflow-y-auto">
                  {allDepots.map((depot) => (
                    <button
                      key={depot.id}
                      type="button"
                      onClick={() => {
                        onSelectDepot(depot);
                        setDepotDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-[#F5F5DC]/50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                        depot.id === cartDepot.id ? 'bg-[#0E01B5]/10 dark:bg-[#0E01B5]/25 border-l-3 border-[#0E01B5]' : ''
                      }`}
                    >
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                        {depot.name}
                        {depot.isCentralHub && (
                          <span className="bg-[#0E01B5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">HQ</span>
                        )}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{depot.region}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100 dark:divide-gray-800">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Your wholesale order is empty</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Add cases or bottles from the online catalog or the quick matrix order pad to begin.
                </p>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const pricing = calculateItemPricing(item);
                return (
                  <div key={index} className="py-3 flex items-start gap-3">
                    <img
                      src={getProductImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain bg-gray-50 dark:bg-[#25253d] p-1 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, item.product.fallbackImage)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-[#0E01B5] dark:text-[#8c82ff] font-semibold uppercase">
                            {item.product.brand} • {item.product.abv}% ABV
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1b1b2d] text-[9px] font-bold">
                            <button
                              type="button"
                              onClick={() => onUpdateOrderType(index, 'bottle')}
                              className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                                item.orderType === 'bottle'
                                  ? 'bg-[#0E01B5] text-white'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d]'
                              }`}
                            >
                              Bottle
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateOrderType(index, 'case')}
                              className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                                item.orderType === 'case'
                                  ? 'bg-[#0E01B5] text-white'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25253d]'
                              }`}
                            >
                              Case ({item.product.casePack})
                            </button>
                          </div>

                          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1b1b2d]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              className="px-1.5 py-0.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e2e48]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold min-w-[20px] text-center text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="px-1.5 py-0.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e2e48]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-900 dark:text-white block">
                            {formatKes(pricing.netSubtotal)}
                          </span>
                          {pricing.discountAmount > 0 && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              -{pricing.discountPct}% ({formatKes(pricing.discountAmount)} off)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* B2B References Fields */}
            {cartItems.length > 0 && (
              <div className="pt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Venue Purchase Order (PO) / Reference Number:
                  </label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="e.g. PO-LOFT-2026-089"
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Special Receiving Instructions / Gate Offloading:
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Deliver via Service Entrance B, ask for Storekeeper Brian"
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer & Tax Calculation */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12121e] space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Gross Wholesale Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatKes(totals.grossSubtotal)}</span>
                </div>

                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>Volume Tier Discount Savings</span>
                    <span>-{formatKes(totals.totalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                  <span>Inclusive 16% VAT Element (Kenya)</span>
                  <span className="font-mono">{formatKes(totals.vatAmount)}</span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span>Net Payable Amount:</span>
                  <span className="text-[#0E01B5] dark:text-[#8c82ff] text-base sm:text-lg">{formatKes(totals.grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onGenerateQuotation}
                  className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#25253d] text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Pro-Forma Quote
                </button>

                <button
                  type="button"
                  onClick={onProceedCheckout}
                  className="py-2.5 px-3 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Submit Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
