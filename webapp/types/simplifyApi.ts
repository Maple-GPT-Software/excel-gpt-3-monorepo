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

export type User = {
  uid: string;
  email: string;
  name: string;
  signUpSource: string;
  referrer: string;
};
