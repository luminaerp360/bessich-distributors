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

  if (tier === 'wholesale') {
    return {
      ...product,
      priceTier: 'wholesale',
      bottlePriceKes: wholesaleBottle,
      casePriceKes: wholesaleCase,
      wholesaleBottlePriceKes: wholesaleBottle,
      wholesaleCasePriceKes: wholesaleCase,
    };
  }

  const retailBottle = getRetailBottlePrice(product);
  return {
    ...product,
    priceTier: 'retail',
    bottlePriceKes: retailBottle,
    casePriceKes: retailBottle * product.casePack,
    wholesaleBottlePriceKes: wholesaleBottle,
    wholesaleCasePriceKes: wholesaleCase,
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