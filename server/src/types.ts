// ENUM FOR ENVIRONMENT
export enum Environment {
  PROD = 'production',
  DEV = 'development',
  TEST = 'test',
}

/**
 * Stripe webhook events https://stripe.com/docs/api/events/types
 */
export enum StripeWebhooks {
  /**
   * We get this event after 1) user signs up for free trial, or 2) checkouts for the first time for a premium subscription
   */
  CustomerCreated = 'customer.created',
  /**
   * When a user starts a trial or subscribes to premium after trial expiration. We get the following statuses:
   *  - trialing : trial has started
   *  - active : subscribed to premium after trial ends or subscribed directly for premium
   */
  SubscriptionCreated = 'customer.subscription.created',
  /**
   * Subscriptions are updated when card info changes, switching from trial to premium
   *  - invoice succeeds, status: active
   *  - invoice fails, status: past_due.
   *  - switched to premium invoice succeeds, status: active
   *  - switched to premium invoice failed. status: past_due
   *  - switched to premium during trial period, status: active
   */
  SubscriptionUpdated = 'customer.subscription.updated',
  /**
   * When a user cancels their subscription. We only allow "cancel immediately"
   *  - status: canceled
   */
  SubscriptionDeleted = 'customer.subscription.deleted',
}

export enum ClientSources {
  APPSCRIPT = 'APPSCRIPT',
  WEBAPP = 'WEBAPP',
  EXCEL = 'EXCEL',
}
