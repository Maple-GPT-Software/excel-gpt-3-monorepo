export interface SimplifyUser {
  userId: string;
  email: string;
  name: string;
  referrer: string;
  hasAcceptedTerms: boolean;
  acceptedTermsVersion: number;
  hasLifetimeAccess: boolean;
  stripeCustomerId: string;
  stripeCurrentPeriodEnd: number;
  stripeStatus: string;
}

/** IDs for Stripe prices accepted by Simplify API */
export enum PriceIds {
  STANDALONE_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk',
  /** price_id for lifetime access to chat */
  LIFETIME_CHAT_ACCESS = 'price_1Mn9ECGB7M3KTCGBq6qXZWpG',
}
