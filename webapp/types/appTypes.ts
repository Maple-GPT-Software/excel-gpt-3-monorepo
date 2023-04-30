// types that don't have a suitable place can go here
// ideally we declare the types where they are used instead of creating many small type files
// https://medium.com/mintbean-io/how-i-organize-my-typescript-types-d9ae7f3ac30f

/** possible subscription types when registering */
export enum RegistrationParamValues {
  PREMIUM = 'premium',
  FREE_TRIAL = 'free-trial',
}

export enum RegistrationParamKeys {
  SUBSCRIPTION = 'subscription',
  REFERRER = 'referrer',
}
