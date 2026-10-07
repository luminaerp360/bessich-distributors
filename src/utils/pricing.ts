import { Product } from '../types';

export type PricingTier = 'wholesale' | 'retail';

/**
 * Retail (normal walk-in) price is derived from the product's recommended
 * retail price when available, otherwise a standard markup over wholesale.
 */
export const RETAIL_MARKUP = 1.25;

export function getRetailBottlePrice(product: Product): number {
  const wholesale = product.wholesaleBottlePriceKes ?? product.bottlePriceKes;
  if (product.retailerRrpKes && product.retailerRrpKes > wholesale) {
    return product.retailerRrpKes;
  }
  return Math.round(wholesale * RETAIL_MARKUP);
}

/**
 * Returns a product copy whose active `bottlePriceKes` / `casePriceKes`
 * reflect the requested pricing tier. Registered (wholesale) accounts keep
 * trade pricing; guests are shown normal retail pricing.
 */
export function applyPricingTier(product: Product, tier: PricingTier): Product {
  const wholesaleBottle = product.wholesaleBottlePriceKes ?? product.bottlePriceKes;
  const wholesaleCase = product.wholesaleCasePriceKes ?? product.casePriceKes;
  const wholesaleCompareAtBottle = product.compareAtBottlePriceKes;
  const wholesaleCompareAtCase = product.compareAtPriceKes;

  if (tier === 'wholesale') {
    const savingsBottle =
      wholesaleCompareAtBottle && wholesaleCompareAtBottle > wholesaleBottle
        ? wholesaleCompareAtBottle - wholesaleBottle
        : undefined;
    const savingsCase =
      wholesaleCompareAtCase && wholesaleCompareAtCase > wholesaleCase
        ? wholesaleCompareAtCase - wholesaleCase
        : undefined;

    return {
      ...product,
      priceTier: 'wholesale',
      bottlePriceKes: wholesaleBottle,
      casePriceKes: wholesaleCase,
      compareAtBottlePriceKes: wholesaleCompareAtBottle,
      compareAtPriceKes: wholesaleCompareAtCase,
      wholesaleBottlePriceKes: wholesaleBottle,
      wholesaleCasePriceKes: wholesaleCase,
      savingsAmountBottleKes: savingsBottle,
      savingsAmountKes: savingsCase,
    };
  }

  // Retail Tier (marked up by RETAIL_MARKUP or RRP)
  const retailBottle = getRetailBottlePrice(product);
  const retailCase = retailBottle * product.casePack;

  // Scale compare-at price to retail as well so promotion strikethrough is consistent
  let retailCompareAtBottle = wholesaleCompareAtBottle
    ? Math.round(wholesaleCompareAtBottle * RETAIL_MARKUP)
    : undefined;
  let retailCompareAtCase = retailCompareAtBottle
    ? retailCompareAtBottle * product.casePack
    : undefined;

  // If promo is active, ensure the compare-at price is always strictly greater than retailBottle
  if (product.isPromoActive) {
    if (!retailCompareAtBottle || retailCompareAtBottle <= retailBottle) {
      const pct = product.savingsPercentage && product.savingsPercentage > 0 ? product.savingsPercentage : 15;
      retailCompareAtBottle = Math.round(retailBottle / (1 - pct / 100));
      retailCompareAtCase = retailCompareAtBottle * product.casePack;
    }
  }

  const retailSavingsBottle =
    retailCompareAtBottle && retailCompareAtBottle > retailBottle
      ? retailCompareAtBottle - retailBottle
      : undefined;
  const retailSavingsCase =
    retailCompareAtCase && retailCompareAtCase > retailCase
      ? retailCompareAtCase - retailCase
      : undefined;

  return {
    ...product,
    priceTier: 'retail',
    bottlePriceKes: retailBottle,
    casePriceKes: retailCase,
    compareAtBottlePriceKes: retailCompareAtBottle,
    compareAtPriceKes: retailCompareAtCase,
    wholesaleBottlePriceKes: wholesaleBottle,
    wholesaleCasePriceKes: wholesaleCase,
    savingsAmountBottleKes: retailSavingsBottle,
    savingsAmountKes: retailSavingsCase,
  };
}

export function applyPricingTierToProducts(
  products: Product[],
  tier: PricingTier
): Product[] {
  return products.map((p) => applyPricingTier(p, tier));
}

export function wholesaleSavingPct(product: Product): number {
  const wholesale = product.wholesaleBottlePriceKes ?? product.bottlePriceKes;
  const retail = getRetailBottlePrice(product);
  if (retail <= wholesale) return 0;
  return Math.round(((retail - wholesale) / retail) * 100);
}