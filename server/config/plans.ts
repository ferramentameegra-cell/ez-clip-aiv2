/**
 * Configuração de planos e preços
 */

export const PLANS = {
  starter: {
    key: 'starter',
    name: 'Starter',
    monthlyCredits: 10,
    prices: {
      month: { 
        amount: 29.00, 
        stripePriceId: process.env.STRIPE_PRICE_STARTER_MONTH || '' 
      },
      year: { 
        amount: 299.00, 
        stripePriceId: process.env.STRIPE_PRICE_STARTER_YEAR || '' 
      },
    },
    availableIntervals: ['month', 'year'] as const,
  },
  creator: {
    key: 'creator',
    name: 'Creator',
    monthlyCredits: 50,
    prices: {
      month: { 
        amount: 79.00, 
        stripePriceId: process.env.STRIPE_PRICE_CREATOR_MONTH || '' 
      },
      year: { 
        amount: 799.00, 
        stripePriceId: process.env.STRIPE_PRICE_CREATOR_YEAR || '' 
      },
    },
    availableIntervals: ['month', 'year'] as const,
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    monthlyCredits: 200,
    prices: {
      month: { 
        amount: 199.00, 
        stripePriceId: process.env.STRIPE_PRICE_PRO_MONTH || '' 
      },
      year: { 
        amount: 1999.00, 
        stripePriceId: process.env.STRIPE_PRICE_PRO_YEAR || '' 
      },
    },
    availableIntervals: ['month', 'year'] as const,
  },
};

export type PlanKey = keyof typeof PLANS;

