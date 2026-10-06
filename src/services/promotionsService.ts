import { Promotion } from '../types';

// Mock commerce data used until the live e-commerce promotions endpoint is
// wired up. The shape mirrors what the backend will return so the UI does not
// need to change when the real data source is connected.
const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-live-sync',
    kind: 'innovation',
    badge: 'NEW',
    title: 'Lumina Live Catalog Sync',
    description:
      'Stock, pricing and new arrivals now sync in real time from our e-commerce platform — accurate availability on every order.',
  },
  {
    id: 'promo-festive-bonus',
    kind: 'promotion',
    badge: 'HOT',
    title: 'Festive Case Bonus',
    description: 'Buy 10 cases of any EABL lager and get 1 case free. Applied automatically at checkout.',
    value: 'Buy 10 Get 1',
    validUntil: '31 Dec 2026',
  },
  {
    id: 'promo-volume-tier',
    kind: 'discount',
    title: 'Volume Tier Discount',
    description: 'Orders above 50 cases automatically unlock our premium wholesale tier pricing.',
    value: 'Up to 12% Off',
    code: 'VOLUME50',
  },
  {
    id: 'promo-cbd-delivery',
    kind: 'discount',
    title: 'Free Eldoret CBD Delivery',
    description: 'Same-day dispatch at zero delivery cost on orders above 30 cases within Eldoret CBD.',
    value: 'KSh 0 Delivery',
    validUntil: 'Ongoing',
  },
  {
    id: 'promo-welcome',
    kind: 'promotion',
    title: 'New Account Welcome Offer',
    description: 'Verified first-time trade accounts receive a discount on their opening consignment.',
    value: '5% Off First Order',
    code: 'WELCOME5',
  },
  {
    id: 'promo-smart-reorder',
    kind: 'innovation',
    badge: 'BETA',
    title: 'Smart Reorder Suggestions',
    description: 'Personalised recommendations based on your purchase history and seasonal demand.',
  },
];

export function getMockPromotions(): Promotion[] {
  return MOCK_PROMOTIONS;
}

// TODO: Replace with a live call to the e-commerce promotions endpoint once
// the backend exposes it. Callers already treat this as async.
export async function fetchPromotions(): Promise<Promotion[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PROMOTIONS), 250);
  });
}
