import { CartItem } from '../types';

export function formatKes(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-KE').format(num);
}

/**
 * Calculates item subtotal, applicable volume tier discount, and net price
 */
export function calculateItemPricing(item: CartItem) {
  const { product, orderType, quantity } = item;
  const basePricePerUnit = orderType === 'case' ? product.casePriceKes : product.bottlePriceKes;
  const rawSubtotal = basePricePerUnit * quantity;

  let discountPct = 0;
  if (orderType === 'case') {
    // Find best matching volume tier
    for (const tier of product.tiers) {
      if (quantity >= tier.minCases && tier.discountPercentage > discountPct) {
        discountPct = tier.discountPercentage;
      }
    }
  }

  const discountAmount = Math.round((rawSubtotal * discountPct) / 100);
  const netSubtotal = rawSubtotal - discountAmount;

  return {
    rawSubtotal,
    discountPct,
    discountAmount,
    netSubtotal,
  };
}

/**
 * Calculates cart totals including VAT (16% standard VAT included/broken down)
 * and Delivery fee (Free for orders >= KES 30,000)
 */
export function calculateOrderTotals(items: CartItem[]) {
  let grossSubtotal = 0;
  let totalDiscount = 0;
  let totalBottlesEquivalent = 0;
  let totalCases = 0;

  for (const item of items) {
    const pricing = calculateItemPricing(item);
    grossSubtotal += pricing.rawSubtotal;
    totalDiscount += pricing.discountAmount;

    if (item.orderType === 'case') {
      totalCases += item.quantity;
      totalBottlesEquivalent += item.quantity * item.product.casePack;
    } else {
      totalBottlesEquivalent += item.quantity;
    }
  }

  const netSubtotal = grossSubtotal - totalDiscount;
  // In Kenya VAT on alcoholic beverages is standard 16% (usually quoted tax-inclusive wholesale)
  // VAT element = netSubtotal * 16 / 116
  const vatAmount = Math.round((netSubtotal * 16) / 116);

  // No separate delivery charges — transport is included in the price.
  const deliveryFee = 0;
  const grandTotal = netSubtotal;

  return {
    grossSubtotal,
    totalDiscount,
    netSubtotal,
    vatAmount,
    deliveryFee,
    grandTotal,
    totalCases,
    totalBottlesEquivalent,
  };
}
