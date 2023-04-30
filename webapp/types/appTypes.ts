// types that don't have a suitable place can go here
// ideally we declare the types where they are used instead of creating many small type files
// https://medium.com/mintbean-io/how-i-organize-my-typescript-types-d9ae7f3ac30f

/** possible subscription types when registering */
export enum SubscriptionURLParams {
  PREMIUM = 'premium',
  /** user signing up for lifetime access */
  LIFETIME_CHAT_ACCESS = 'lifetime',
}

export enum RegistrationParamKeys {
  SUBSCRIPTION = 'subscription',
  REFERRER = 'referrer',
}
