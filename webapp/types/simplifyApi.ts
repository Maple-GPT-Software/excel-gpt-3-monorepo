export interface SimplifyUser {
  userId: string;
  email: string;
  name: string;
  referrer: string;
  hasAcceptedTerms: boolean;
  acceptedTermsVersion: number;
  stripeCustomerId: string;
  stripeLifetimeAccessPaymentId: string;
  /** current period end as unix timestamp in seconds */
  stripeCurrentPeriodEnd: number;
  stripeStatus?: string;
  openAiApiKey?: string;
}
