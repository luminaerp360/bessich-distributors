import { B2BOrder } from '../types';

const STORAGE_PREFIX = 'bessich_orders_v1';

export function getOrderStoreKey(userId: string | null): string {
  return userId ? `${STORAGE_PREFIX}_${userId}` : `${STORAGE_PREFIX}_guest`;
}

export function getStoredOrders(userId: string | null): B2BOrder[] {
  try {
    const raw = localStorage.getItem(getOrderStoreKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as B2BOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(userId: string | null, order: B2BOrder): B2BOrder[] {
  const key = getOrderStoreKey(userId);
  const existing = getStoredOrders(userId);
  const updated = [
    order,
    ...existing.filter((o) => o.id !== order.id),
  ];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // Storage unavailable — history will not persist.
  }
  return updated;
}

export function clearStoredOrders(userId: string | null): void {
  try {
    localStorage.removeItem(getOrderStoreKey(userId));
  } catch {
    // ignore
  }
}

/**
 * Moves orders placed as a guest into the user's own history after they
 * sign in or create an account, preserving one-time orders for tracking.
 */
export function migrateGuestOrders(userId: string): B2BOrder[] {
  const guestOrders = getStoredOrders(null);
  if (guestOrders.length === 0) return getStoredOrders(userId);
  const userOrders = getStoredOrders(userId);
  const merged = [...guestOrders, ...userOrders];
  // de-duplicate by order id
  const unique = Array.from(new Map(merged.map((o) => [o.id, o])).values());
  try {
    localStorage.setItem(getOrderStoreKey(userId), JSON.stringify(unique));
    localStorage.removeItem(getOrderStoreKey(null));
  } catch {
    // ignore
  }
  return unique;
}

export interface OrderStats {
  totalOrders: number;
  totalSpentKes: number;
  totalCases: number;
  pendingCount: number;
  confirmedCount: number;
  deliveredCount: number;
  cancelledCount: number;
}

export function computeOrderStats(orders: B2BOrder[]): OrderStats {
  return orders.reduce<OrderStats>(
    (acc, order) => {
      acc.totalOrders += 1;
      acc.totalSpentKes += order.totalKes;
      acc.totalCases += order.items.reduce((sum, item) => sum + item.quantity, 0);
      const status = order.status.toLowerCase();
      if (status.includes('cancel')) acc.cancelledCount += 1;
      else if (status.includes('deliver')) acc.deliveredCount += 1;
      else if (status.includes('confirm') || status.includes('pending')) acc.pendingCount += 1;
      else if (status.includes('order')) acc.confirmedCount += 1;
      return acc;
    },
    {
      totalOrders: 0,
      totalSpentKes: 0,
      totalCases: 0,
      pendingCount: 0,
      confirmedCount: 0,
      deliveredCount: 0,
      cancelledCount: 0,
    }
  );
}