import Stripe from 'stripe';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ENUM FOR ENVIRONMENT
export enum Environment {
  PROD = 'production',
  DEV = 'development',
  TEST = 'test',
}

export enum IClientSource {
  APPSCRIPT = 'APPSCRIPT',
  WEBAPP = 'WEBAPP',
  EXCEL = 'EXCEL',
}

// STRIPE WEBHOOK EVENTS ================================================

/**
 * Stripe webhook events https://stripe.com/docs/api/events/types
 */
export enum StripeWebhooks {
  /**
   * We get this event after 1) user signs up for free trial, or 2) checkouts for the first time for a premium subscription
   */
  CustomerCreated = 'customer.created',
  /** When a payment has been successfully charged */
  PaymentSucceeded = 'payment_intent.succeeded',
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

// USER ============================================================

// NOTE: _id: is firebase's uid converted into a 24 character hex string
export interface DUser {
  email: string;
  name: string;
  /** e.g, Concordia */
  referrer: string;
  /** terms and conditions and the version the user has accepted */
  hasAcceptedTerms: boolean;
  acceptedTermsVersion: number;
  simplifyTrialEnd: number;
  /**
   * We don't have to keep all the metadata associated with a subscription because Stripe's client facing SDK has no rate limiting. Server side API however has a limit of 100 reads/min.
   */
  /** stripe customer id associated with user's email */
  stripeCustomerId?: string;
  /** the end of the bill cycle of the user's subscription */
  stripeCurrentPeriodEnd?: number;
  /**
   * possible statuses: paid, incomplete, trialing, active, past_due, canceled. We don't allow users to pause their subscription.
   */
  stripeStatus?: Stripe.Subscription.Status;
  /** the amount of unused credits. For every API call we calculate calculate the cost of the user's API call. */
  // /** the user's open AI API key */
  // openaiApiKey: string;
}

// CONVERSATION ==========================================================

export interface DConversation {
  userId: string;
  name: string;
  isSaved: boolean;
  systemPrompt: string;
  /**
   * between 0 and 2. Higher values like 0.8 will make the output more random,
   * while lower values like 0.2 will make it more focused and deterministic.
   * https://platform.openai.com/docs/api-reference/completions/create#completions/create-temperature
   */
  temperature: number;
  /** the client that created this conversation */
  source: IClientSource;
  // FUTURE: folderId: string
}

// MESSAGES ==========================================================

export enum DMessageRating {
  LIKE = 'LIKE',
  DISLIK = 'DISLIKE',
}

export enum DMessageAuthor {
  ASSISTANT = 'assistant',
  USER = 'user',
}

export interface DMessageBase {
  /** the conversation this message belongs to */
  conversationId: string;
  /** user the message belongs to */
  userId: string;
  author: DMessageAuthor;
  content: string;
  source: IClientSource;
}

export interface DMessage extends DMessageBase {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  model?: string;
  rating?: DMessageRating | '';
  memoryCount?: string;
}

export interface DAsssistantMessage extends DMessage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
}

// FUTURE: custom prompts that the user wants to use
// PROMPTS ==========================================================

// export interface DSystemPrompt {
//   userId: string;
//   prompt: string;
// }
