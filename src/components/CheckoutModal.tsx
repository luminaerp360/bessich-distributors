import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  Smartphone,
  MapPin,
  Phone,
  ArrowRight,
  Banknote,
  Clock,
  ShieldCheck,
  UserCircle2,
  Printer,
  AlertTriangle,
  Package,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, B2BProfile, Depot, B2BOrder } from '../types';
import { AuthUser } from '../services/authService';
import { createOrder, CreateOrderPayload } from '../services/ordersService';
import { initiateStkPush, pollMpesaPayment } from '../services/mpesaService';
import { saveOrder } from '../services/orderStore';
import { useAuth } from '../context/AuthContext';
import { formatKes, calculateOrderTotals } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  b2bProfile: B2BProfile;
  activeDepot: Depot;
  poNumber: string;
  orderNotes: string;
  authUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
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
  authUser,
  onOpenAuth,
  onOrderSuccess,
}) => {
  const { getToken, user: sessionUser } = useAuth();

  const totals = calculateOrderTotals(cartItems);

  // Form states
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState('Morning (08:00 - 12:00)');
  const [deliveryLocation, setDeliveryLocation] = useState(b2bProfile.deliveryAddress || '');
  const [deliveryContact, setDeliveryContact] = useState(
    authUser?.phoneNumber || b2bProfile.phoneNumber || ''
  );
  const [isLocating, setIsLocating] = useState(false);
  const locationEditedRef = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(
    authUser?.phoneNumber || b2bProfile.phoneNumber || '0754320000'
  );

  // Order / payment flow states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [serverOrderId, setServerOrderId] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState('');
  const [mpesaPhase, setMpesaPhase] = useState<'idle' | 'waiting' | 'success' | 'failed'>('idle');
  const [mpesaAttempt, setMpesaAttempt] = useState(0);
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<B2BOrder | null>(null);

  // Reset the flow every time the modal reopens so a customer can place
  // multiple orders without being stuck on the previous one.
  useEffect(() => {
    if (!isOpen) return;
    setConfirmedOrder(null);
    setServerOrderId(null);
    setOrderRef('');
    setOrderError('');
    setMpesaPhase('idle');
    setMpesaAttempt(0);
    setMpesaMessage('');
    setIsPlacingOrder(false);
    locationEditedRef.current = false;
    locateCurrentPosition();
  }, [isOpen]);

  if (!isOpen) return null;

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`
      );
      const data = await res.json();
      if (data && data.display_name) return data.display_name;
    } catch {
      // fall through to coordinates
    }
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  };

  const locateCurrentPosition = async () => {
    if (!('geolocation' in navigator)) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        if (!locationEditedRef.current) setDeliveryLocation(address);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const buildOrderPayload = (): CreateOrderPayload => ({
    items: cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.orderType === 'case' ? item.product.casePriceKes : item.product.bottlePriceKes,
      notes: orderNotes || 'Bessich B2B wholesale order',
    })),
    shippingAddress: deliveryLocation || b2bProfile.deliveryAddress || undefined,
    paymentMethod: paymentMethod === 'cash' ? 'cash' : 'mpesa',
  });

  const finalizeOrder = (paymentStatus: 'Paid' | 'Pending Payment', method: 'mpesa' | 'cash') => {
    setIsPlacingOrder(false);
    const orderId =
      serverOrderId ||
      `BD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
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
      status: paymentStatus === 'Paid' ? 'Order Confirmed' : 'Pending Verification',
      paymentMethod: method,
      paymentStatus,
      deliveryDate,
      deliverySlot,
      depotName: activeDepot.name,
      businessName: b2bProfile.businessName,
    };

    setConfirmedOrder(newOrder);
    onOrderSuccess(newOrder);

    // Persist the order to this customer's history (account holders get tracked history).
    const userId = sessionUser?._id || sessionUser?.id || null;
    saveOrder(userId, newOrder);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDeliveryContactChange = (value: string) => {
    setDeliveryContact(value);
    // Keep the M-PESA prompt number in sync with the contact number entered.
    setMpesaPhone(value);
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    setIsPlacingOrder(true);
    setMpesaPhase('idle');
    setMpesaMessage('');

    try {
      // 1. Record the order on the e-commerce API.
      const token = getToken();
      const serverOrder = await createOrder(buildOrderPayload(), token);
      setServerOrderId(serverOrder.id);
      setOrderRef(serverOrder.trackingNumber || serverOrder.id);

      // 2. Cash on Delivery — order placed, payment collected upon delivery.
      if (paymentMethod === 'cash') {
        finalizeOrder('Pending Payment', 'cash');
        return;
      }

      // 3. M-PESA — send the STK prompt and wait for confirmation.
      await runMpesaFlow(token, serverOrder.trackingNumber || serverOrder.id);
    } catch (err) {
      setIsPlacingOrder(false);
      setOrderError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    }
  };

  const runMpesaFlow = async (token: string | null, accountRef: string) => {
    setMpesaPhase('waiting');
    setMpesaAttempt(0);
    setMpesaMessage('');
    setIsPlacingOrder(false);

    let checkoutId: string | null = null;
    try {
      const stk = await initiateStkPush(
        {
          phoneNumber: mpesaPhone,
          amount: Math.round(totals.grandTotal),
          accountReference: accountRef,
          transactionDesc: `Payment for order ${accountRef}`,
        },
        token
      );
      checkoutId = stk.CheckoutRequestID || stk.MerchantRequestID || null;
    } catch (err) {
      setMpesaPhase('failed');
      setMpesaMessage(
        'Could not send the M-Pesa prompt. Check the phone number or choose Pay on Delivery to place your order.'
      );
      return;
    }

    const paid = await pollMpesaPayment(mpesaPhone, Math.round(totals.grandTotal), {
      attempts: 24,
      intervalMs: 2500,
      checkoutId: checkoutId || undefined,
      token,
      onAttempt: (attempt) => setMpesaAttempt(attempt),
    });

    if (paid) {
      setMpesaPhase('success');
      finalizeOrder('Paid', 'mpesa');
    } else {
      setMpesaPhase('failed');
      setMpesaMessage(
        'Payment was not confirmed automatically (cancelled or declined on your phone). If you already completed the payment, tap "I have paid" below, or choose Pay on Delivery (Cash).'
      );
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const paymentStatusBadge = (status: string) => (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
        status === 'Paid'
          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
      }`}
    >
      {status === 'Paid' ? (
        <>
          <CheckCircle2 className="w-3 h-3" /> Paid — M-Pesa Confirmed
        </>
      ) : (
        <>
          <Clock className="w-3 h-3" /> Pending Payment — Pay on Delivery
        </>
      )}
    </span>
  );

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
                Checkout
              </span>
              <span className="bg-[#0E01B5] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                {activeDepot.name}
              </span>
            </div>
            <h3 className="font-extrabold text-lg sm:text-xl font-display mt-0.5">
              {confirmedOrder ? 'Order Placed' : 'Confirm Your Order'}
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
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-xs ${
                  confirmedOrder.paymentStatus === 'Paid'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}
              >
                {confirmedOrder.paymentStatus === 'Paid' ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <Clock className="w-8 h-8" />
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                {paymentStatusBadge(confirmedOrder.paymentStatus)}
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {confirmedOrder.paymentStatus === 'Paid'
                  ? 'Payment Successful — Order Confirmed!'
                  : 'Order Placed — Pay on Delivery'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {confirmedOrder.paymentStatus === 'Paid'
                  ? 'Your M-Pesa payment was received. Your consignment is confirmed and queued for dispatch from the ' + activeDepot.name + '.'
                  : 'Your order has been recorded. The total of ' + formatKes(confirmedOrder.totalKes) + ' will be collected upon delivery from the ' + activeDepot.name + '.'}
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-[#FAF9F6] dark:bg-[#12121e] p-5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                <div>
                  <div className="font-bold text-sm text-[#0E01B5] dark:text-[#8c82ff]">BESSICH DISTRIBUTORS LTD</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Jumbo House, Iten Rd, Eldoret • KRA PIN: P051992014B
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-gray-900 dark:text-white">{confirmedOrder.id}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">PO: {confirmedOrder.poNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Deliver To:</span>
                  <span className="font-bold text-gray-900 dark:text-white block">{confirmedOrder.businessName}</span>
                  <span className="text-gray-500 dark:text-gray-400 block">{deliveryLocation || b2bProfile.deliveryAddress}</span>
                  <span className="text-gray-500 dark:text-gray-400 block font-mono">{deliveryContact || b2bProfile.phoneNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-bold">Dispatch:</span>
                  <span className="font-bold text-gray-900 dark:text-white block">{confirmedOrder.deliveryDate}</span>
                  <span className="text-gray-500 dark:text-gray-400 block">{confirmedOrder.deliverySlot}</span>
                  <span className="text-gray-500 dark:text-gray-400 block font-mono">{confirmedOrder.depotName}</span>
                </div>
              </div>

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
                Print Invoice
              </button>
              {!authUser && onOpenAuth && (
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="flex-1 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <UserCircle2 className="w-4 h-4" />
                  Create Account to Track This Order
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 w-full py-2.5 px-4 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Truck className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Inputs Form */
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Account / Guest slim bar */}
            {authUser ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    {[authUser.firstName, authUser.lastName].filter(Boolean).join(' ') || authUser.email}
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-300 block text-[10px]">
                    {authUser.email} — this order is added to your order history for tracking.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#F5F5DC]/40 dark:bg-[#23233a] border border-[#F5F5DC] dark:border-gray-700 text-xs">
                <UserCircle2 className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
                <span className="text-gray-600 dark:text-gray-300">
                  Continue as a guest, or
                </span>
                {onOpenAuth && (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('login')}
                      className="px-3 py-1 rounded-lg bg-[#0E01B5] hover:bg-[#09007A] text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('signup')}
                      className="px-3 py-1 rounded-lg border border-[#0E01B5] dark:border-[#8c82ff] text-[#0E01B5] dark:text-[#8c82ff] text-[11px] font-bold cursor-pointer transition-colors hover:bg-[#0E01B5]/5"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Order error banner */}
            {orderError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Step 1: Delivery Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F2693F]" />
                1. Delivery Details
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Delivery Location / Address:
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={deliveryLocation}
                      onChange={(e) => {
                        locationEditedRef.current = true;
                        setDeliveryLocation(e.target.value);
                      }}
                      placeholder="e.g. Rupa Mall, 3rd Floor, Malaba Rd, Eldoret"
                      className="w-full p-2 pl-8 pr-24 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={locateCurrentPosition}
                      disabled={isLocating}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-[#0E01B5]/10 dark:bg-[#8c82ff]/10 text-[#0E01B5] dark:text-[#8c82ff] text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#0E01B5] hover:text-white transition-colors disabled:opacity-60"
                    >
                      <Navigation className="w-3 h-3" />
                      {isLocating ? 'Locating...' : 'My Location'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {isLocating
                      ? 'Getting your current location...'
                      : 'Pre-filled with your current location by default. You can edit it anytime.'}
                  </p>
                </div>

                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Contact Phone Number:
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="tel"
                      value={deliveryContact}
                      onChange={(e) => handleDeliveryContactChange(e.target.value)}
                      placeholder="e.g. 0712 345 678"
                      className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-[#1b1b2d] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                2. Payment Method
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* M-PESA */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      M-PESA
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
                    Instant STK push prompt. Order is confirmed once payment is received.
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#0E01B5] dark:border-[#8c82ff] bg-[#0E01B5]/5 dark:bg-[#0E01B5]/20 ring-1 ring-[#0E01B5] dark:ring-[#8c82ff]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff]" />
                      Cash on Delivery
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="text-[#0E01B5]"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Pay the driver upon delivery. Order is marked pending payment.
                  </span>
                </label>
              </div>

              {/* M-PESA phone number + status panel */}
              {paymentMethod === 'mpesa' && mpesaPhase === 'idle' && (
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2 animate-in fade-in">
                  <div className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    M-PESA STK Push
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
                    A secure prompt will be sent to this number for KES {totals.grandTotal.toLocaleString()}. Bessich Till: 5824102 / Paybill 891200.
                  </p>
                </div>
              )}

              {paymentMethod === 'mpesa' && mpesaPhase === 'waiting' && (
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="font-bold text-emerald-950 dark:text-emerald-200">
                      Waiting for M-PESA Confirmation...
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    STK prompt sent to <b>{mpesaPhone}</b>. Check your phone and enter your M-PESA PIN to complete payment for KES{' '}
                    {totals.grandTotal.toLocaleString()}. Polling for confirmation{mpesaAttempt > 0 ? ` (attempt ${mpesaAttempt}/24)` : ''}...
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mpesaAttempt >= 2 && (
                      <button
                        type="button"
                        onClick={() => finalizeOrder('Paid', 'mpesa')}
                        className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        I have paid — Confirm Order
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => finalizeOrder('Pending Payment', 'cash')}
                      className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Skip M-PESA & Pay on Delivery (Cash)
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'mpesa' && mpesaPhase === 'failed' && (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      M-PESA Payment Not Completed
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">{mpesaMessage}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => finalizeOrder('Paid', 'mpesa')}
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      I have paid
                    </button>
                    <button
                      type="button"
                      onClick={() => runMpesaFlow(getToken(), orderRef || serverOrderId || '')}
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Retry M-PESA
                    </button>
                    <button
                      type="button"
                      onClick={() => finalizeOrder('Pending Payment', 'cash')}
                      className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Pay on Delivery (Cash)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Total Box */}
            <div className="p-4 bg-[#FAF9F6] dark:bg-[#12121e] rounded-xl border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
                  Order Line Total:
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{formatKes(totals.netSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                <span>Total Payable:</span>
                <span className="text-[#0E01B5] dark:text-[#8c82ff]">{formatKes(totals.grandTotal)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              {paymentMethod === 'mpesa' && mpesaPhase === 'waiting' ? (
                <div className="w-full py-3.5 px-6 rounded-xl bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2 border border-emerald-500/40 cursor-not-allowed">
                  <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  Awaiting M-PESA Payment Confirmation...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0E01B5] hover:bg-[#09007A] text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer disabled:opacity-75"
                >
                  {isPlacingOrder ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <span>{paymentMethod === 'cash' ? 'Place Order — Pay on Delivery' : `Place Order (${formatKes(totals.grandTotal)})`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
              <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-2">
                {paymentMethod === 'mpesa'
                  ? 'M-PESA payments are verified via STK push confirmation. Cash orders are marked pending until delivery.'
                  : 'Cash is collected by the driver upon delivery. Your order remains pending until then.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};