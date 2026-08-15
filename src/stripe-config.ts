export const STRIPE_PRODUCTS = [
  {
    id: 'prod_V2ZtTjdSk5QFfr',
    priceId: 'price_1U2UjIHtzNB13yyaN1rnf69N',
    name: 'Astrologlimpse Membership',
    description: 'Unlock full access to personalized cosmic readings, planetary transits, lunar rituals, tarot insights, and more.',
    price: 9.99,
    currency: 'usd',
    currencySymbol: '$',
    mode: 'subscription' as const,
    features: [
      'Daily personalized horoscopes for all 12 signs',
      'Full planetary transit forecasts & advice',
      'Lunar phase rituals & moon cycle guidance',
      'Tarot card readings & interpretations',
      'Crystal & botanical recommendations',
      'Shadow work prompts & elemental energy insights',
    ],
  },
] as const;

export type StripeProduct = (typeof STRIPE_PRODUCTS)[number];