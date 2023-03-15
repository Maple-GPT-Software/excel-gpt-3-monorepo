// types that don't have a suitable place can go here
// ideally we declare the types where they are used instead of creating many small type files
// https://medium.com/mintbean-io/how-i-organize-my-typescript-types-d9ae7f3ac30f

/** possible subscription types when registering */
export enum SubscriptionURLParams {
  PREMIUM = 'premium',
}

/** IDs for Stripe prices accepted by Simplify API */
export enum PriceIds {
  STANDALONE_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk',
}
