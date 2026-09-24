import React, { useState } from 'react';
import {
  Package,
  Wallet,
  Boxes,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Printer,
  ReceiptText,
  ShoppingCart,
  UserCircle2,
} from 'lucide-react';
import { B2BOrder } from '../types';
import { formatKes } from '../utils/formatters';
import { getStoredOrders, computeOrderStats, OrderStats } from '../services/orderStore';

interface MyOrdersSectionProps {
  userId: string | null;
  userName?: string;
  onReorder: (order: B2BOrder) => void;
  onNavigateCatalog?: () => void;
}

const EMPTY_STATS: OrderStats = {
  totalOrders: 0,
  totalSpentKes: 0,
  totalCases: 0,
  pendingCount: 0,
  confirmedCount: 0,
  deliveredCount: 0,
  cancelledCount: 0,
};

const STATUS_BADGE: Record<string, { label: string; classes: string }> = {
  'Pending Verification': { label: 'Pending Verification', classes: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
  'Order Confirmed': { label: 'Confirmed', classes: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
  'Pallet Assembled': { label: 'Processing', classes: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400' },
  Dispatched: { label: 'Dispatched', classes: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' },
  Delivered: { label: 'Delivered', classes: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' },
};

export const MyOrdersSection: React.FC<MyOrdersSectionProps> = ({
  userId,
  userName,
  onReorder,
  onNavigateCatalog,
}) => {
  const [orders] = useState<B2BOrder[]>(() => getStoredOrders(userId));
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const stats = orders.length > 0 ? computeOrderStats(orders) : EMPTY_STATS;

  const filteredOrders = orders.filter((o) => {
    if (filter === 'paid') return o.paymentStatus === 'Paid';
    if (filter === 'pending') return o.paymentStatus !== 'Paid';
    return true;
  });

  const statusBadge = (order: B2BOrder) => {
    const badge = STATUS_BADGE[order.status] || {
      label: order.status,
      classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.classes}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3.5">
        <div>
          <div className="text-[11px] sm:text-xs font-bold text-[#0E01B5] dark:text-[#8c82ff] uppercase tracking-wider mb-0.5">
            {userName ? `Welcome back, ${userName}` : 'Account Holder'}
          </div>
          <h2 className="hero-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171728] dark:text-white font-display">
            My Orders &amp; History
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
            Track your wholesale consignments, reorder favourites, and monitor your purchasing statistics.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <Package className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
            Total Orders
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalOrders}</div>
        </div>
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Total Spent
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatKes(stats.totalSpentKes)}</div>
        </div>
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <Boxes className="w-3.5 h-3.5 text-[#F2693F]" />
            Cases Ordered
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalCases}</div>
        </div>
        <div className="bg-white dark:bg-[#171728] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0E01B5] dark:text-[#8c82ff]" />
            Delivered
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.deliveredCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: 'all', label: `All (${orders.length})` },
            { id: 'paid', label: `Paid (${orders.filter((o) => o.paymentStatus === 'Paid').length})` },
            { id: 'pending', label: `Pending (${orders.filter((o) => o.paymentStatus !== 'Paid').length})` },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filter === opt.id
                ? 'bg-[#0E01B5] text-white shadow-sm'
                : 'bg-white dark:bg-[#1b1b2d] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#0E01B5]/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-3">
          <UserCircle2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">No orders found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {orders.length === 0
              ? 'You have not placed any orders yet. Browse the catalog and place your first wholesale order.'
              : 'No orders match the selected filter.'}
          </p>
          {orders.length === 0 && onNavigateCatalog && (
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="inline-flex items-center gap-1.5 bg-[#0E01B5] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#09007A] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Browse Catalog
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#171728] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#F5F5DC]/30 dark:bg-[#23233a] border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-mono font-bold text-xs text-gray-900 dark:text-white">{order.id}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {order.orderDate} • {order.deliverySlot}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(order)}
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order body */}
              <div className="px-4 py-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[240px]">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          {item.quantity} × {item.orderType === 'case' ? 'case' : 'bottle'}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white shrink-0">
                      {formatKes(
                        (item.orderType === 'case' ? item.product.casePriceKes : item.product.bottlePriceKes) *
                          item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-[#12121e]">
                <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> {order.depotName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {order.deliveryDate}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Total: <b className="text-gray-900 dark:text-white">{formatKes(order.totalKes)}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0E01B5] hover:bg-[#09007A] text-white text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" /> Reorder
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-[#25253d] transition-colors"
                  >
                    <Printer className="w-3 h-3" /> Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reassurance */}
      <div className="flex flex-col sm:flex-row items-start gap-3 p-4 rounded-xl bg-[#F5F5DC]/40 dark:bg-[#23233a] border border-[#F5F5DC] dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
        <ReceiptText className="w-4 h-4 text-[#0E01B5] dark:text-[#8c82ff] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Your order history is saved to this browser for this account. Every consignment is also recorded on the
          e-commerce platform against your registered account, so your resale purchasing record is available whenever
          you sign in on this device.
        </p>
      </div>
    </section>
  );
};