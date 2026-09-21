import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Building2, 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, B2BProfile, Depot, B2BOrder } from '../types';
import { formatKes, calculateOrderTotals } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  b2bProfile: B2BProfile;
  activeDepot: Depot;
  poNumber: string;
  orderNotes: string;
  onOrderSuccess: (order: B2BOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  b2bProfile,
  activeDepot,
  poNumber,
  orderNotes,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const totals = calculateOrderTotals(cartItems);

  // Form states
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState('Morning (08:00 - 12:00)');
  const [needsOffloadingCrew, setNeedsOffloadingCrew] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'credit' | 'bank_transfer' | 'cod'>(
    b2bProfile.isVerified && b2bProfile.paymentTermsDays > 0 ? 'credit' : 'mpesa'
  );
  const [mpesaPhone, setMpesaPhone] = useState(b2bProfile.phoneNumber || '0754320000');
  const [mpesaSimulating, setMpesaSimulating] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<B2BOrder | null>(null);

  const handlePlaceOrder = () => {
    if (paymentMethod === 'mpesa') {
      setMpesaSimulating(true);
      setTimeout(() => {
        setMpesaSimulating(false);
        finalizeOrder('Paid');
      }, 2000);
    } else if (paymentMethod === 'credit') {
      finalizeOrder('Authorized on Credit');
    } else {
      finalizeOrder('Pending Payment');
    }
  };

  const finalizeOrder = (paymentStatus: 'Paid' | 'Authorized on Credit' | 'Pending Payment') => {
    const orderId = `BD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: B2BOrder = {
      id: orderId,
      orderDate: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      poNumber: poNumber || `PO-${b2bProfile.businessName.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      items: [...cartItems],
      subtotalKes: totals.grossSubtotal,
      bulkDiscountKes: totals.totalDiscount,
      vatKes: totals.vatAmount,
      deliveryFeeKes: totals.deliveryFee,
      totalKes: totals.grandTotal,
      status: 'Order Confirmed',
      paymentMethod,
      paymentStatus,
      deliveryDate,
      deliverySlot,
      depotName: activeDepot.name,
      businessName: b2bProfile.businessName,
    };

    setConfirmedOrder(newOrder);
    onOrderSuccess(newOrder);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="checkout-modal-container"
        className="bg-white dark:bg-[#171728] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-[#171728] text-white flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                B2B Commercial Procurement
              </span>
              <span className="bg-[#0E01B5] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                {activeDepot.name}
              </span>
            </div>
            <h3 className="font-extrabold text-lg sm:text-xl font-display mt-0.5">
              {confirmedOrder ? 'Commercial Order Confirmed' : 'Confirm Wholesale Order & Dispatch'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {confirmedOrder ? (
          /* Order Confirmation View with Invoice */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Order Placed Successfully!
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Your wholesale consignment has been submitted directly to the {activeDepot.name}. Pallet assembly has been queued.
              </p>
            </div>

            {/* Official Pro-Forma / Tax Invoice Card */}
            <div className="bg-[#FAF9F6] dark:bg-[#12121e] p-5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                <div>
                  <div className="font-bold text-sm text-[#0E01B5] dark:text-[#8c82ff]">BESSICH DISTRIBUTORS LTD</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Jumbo House, Iten Rd, Eldoret • KRA PIN: P051992014B</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-gray-900 dark:text-white">{confirmedOrder.id}</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">{confirmedOrder.paymentStatus}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Consignee (Buyer):</span>
                  <span className="font-bold text-gray-900 dark:text-white block">{confirmedOrder.businessName}</span>
                  <span className="text-gray-500 dark:text-gray-400 block">{b2bProfile.deliveryAddress}</span>
                  <span className="text-gray-500 dark:text-gray-400 block font-mono">KRA PIN: {b2bProfile.kraPin}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Dispatch Schedule:</span>
                  <span className="font-bold text-gray-900 dark:text-white block">{confirmedOrder.deliveryDate}</span>
                  <span className="text-gray-500 dark:text-gray-400 block">{confirmedOrder.deliverySlot}</span>
                  <span className="text-gray-500 dark:text-gray-400 block font-mono">PO: {confirmedOrder.poNumber}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="border-t border-b border-gray-200 dark:border-gray-800 py-2 space-y-1">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="text-gray-800 dark:text-gray-200">
                      {item.quantity} × {item.product.name} ({item.orderType})
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatKes(
                        (item.orderType === 'case' ? item.product.casePriceKes : item.product.bottlePriceKes) * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-xs">
                <div className="text-gray-500 dark:text-gray-400">
                  Inclusive 16% VAT: <span className="font-mono font-medium text-gray-800 dark:text-gray-200">{formatKes(confirmedOrder.vatKes)}</span>
                </div>
                <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                  Total Payable: <span className="text-[#0E01B5] dark:text-[#8c82ff]">{formatKes(confirmedOrder.totalKes)}</span>
                </div>
              </div>
            </div>

            {/* Confirmation actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="flex-1 w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#25253d] text-gray-800 dark:text-gray-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Official Tax Invoice
              </button>
              <a
                href="https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
              >
                <Truck className="w-4 h-4" />
                View on The Bar Kenya
              </a>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 w-full py-2.5 px-4 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Back to Portal
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Inputs Form */
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Receiving Venue & Address */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
                1. Receiving Business & Delivery Address
              </h4>

              <div className="bg-[#FAF9F6] dark:bg-[#12121e] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                  <span>{b2bProfile.businessName}</span>
                  <span className="text-[#0E01B5] dark:text-[#8c82ff]">{b2bProfile.businessType}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {b2bProfile.deliveryAddress}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-3">
                  <span>Attn: {b2bProfile.contactPerson}</span>
                  <span>•</span>
                  <span>{b2bProfile.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Logistics Schedule */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#F2693F]" />
                2. Fulfillment Fleet & Scheduling
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Preferred Delivery Date:
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Receiving Time Slot:
                  </label>
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                  >
                    <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                    <option value="Afternoon (13:00 - 17:00)">Afternoon (13:00 - 17:00)</option>
                    <option value="Early Evening / Pre-Opening (17:00 - 19:30)">Early Evening / Pre-Opening (17:00 - 19:30)</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={needsOffloadingCrew}
                  onChange={(e) => setNeedsOffloadingCrew(e.target.checked)}
                  className="rounded text-[#0E01B5] focus:ring-[#0E01B5]"
                />
                <span>Request Bessich Truck Tailgate Offloading Assistance (Complimentary)</span>
              </label>
            </div>

            {/* Step 3: Payment Settlement Selection */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                3. B2B Commercial Payment Terms
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Lipa na M-PESA */}
                <label 
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Lipa na M-PESA
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={() => setPaymentMethod('mpesa')}
                      className="text-[#0E01B5]"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Bessich Till: 5824102 or Paybill 891200 with instant STK prompt.
                  </span>
                </label>

                {/* B2B Credit Line */}
                <label 
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'credit'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${!b2bProfile.isVerified ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
                      Net-{b2bProfile.paymentTermsDays || 30} Trade Credit
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      disabled={!b2bProfile.isVerified}
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                      className="text-[#0E01B5]"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {b2bProfile.isVerified 
                      ? `Charge to active credit facility. Balance: ${formatKes(b2bProfile.availableCreditKes)}`
                      : 'Available only for verified licensed partners.'}
                  </span>
                </label>

                {/* Bank Wire / RTGS */}
                <label 
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
                      Bank RTGS / Wire
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="text-[#0E01B5]"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Absa Bank Kenya or KCB Eldoret Branch commercial account.
                  </span>
                </label>

                {/* Banker's Cheque on Delivery */}
                <label 
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Cheque / COD
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#0E01B5]"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Pay driver upon physical pallet count verification.
                  </span>
                </label>
              </div>

              {/* M-PESA Phone Number Input if selected */}
              {paymentMethod === 'mpesa' && (
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2 animate-in fade-in">
                  <div className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    M-PESA Express STK Push Authorization
                  </div>
                  <div>
                    <label className="text-emerald-900 dark:text-emerald-300 text-[11px] font-medium block mb-1">
                      Safaricom Mobile Number for PIN Prompt:
                    </label>
                    <input
                      type="text"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="e.g. 0754320000"
                      className="w-full p-2 bg-white dark:bg-[#171728] border border-emerald-300 dark:border-emerald-700 rounded-lg font-mono font-bold text-emerald-950 dark:text-emerald-200 text-xs"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-800 dark:text-emerald-300">
                    A secure payment prompt will be dispatched to your phone for KES {totals.grandTotal.toLocaleString()}.
                  </p>
                </div>
              )}
            </div>

            {/* Order Grand Total Box */}
            <div className="p-4 bg-[#FAF9F6] dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Wholesale Line Total ({totals.totalCases} cases):</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatKes(totals.netSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Fulfillment Depot Transport:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {totals.deliveryFee === 0 ? 'FREE' : formatKes(totals.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                <span>Total Invoice Net:</span>
                <span className="text-[#0E01B5] dark:text-[#8c82ff]">{formatKes(totals.grandTotal)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={mpesaSimulating}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer disabled:opacity-75"
              >
                {mpesaSimulating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending M-PESA STK Push Prompt...
                  </>
                ) : (
                  <>
                    <span>Confirm Wholesale Order ({formatKes(totals.grandTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
