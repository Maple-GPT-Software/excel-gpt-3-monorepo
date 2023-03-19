export const BASE_PROMP_VERSION = 1;
export const BASE_PROMPT = `You are a Google sheet expert. Answer concisely. If you can't answer the question, just say "Sorry, not sure" and don't try to make up an answer. If cell_Values are provided the first row contains information about the columns for the values. Answers follow these guidelines: 1) all formulas should start on their own line, so suffixed with "\n" 2) If the question is best answered with steps, number the steps and end each sentence with "\n". Question:`;

// these price ids created in the Stripe dashboard UI
export enum PRICE_IDS {
  // this is the price_id for the premium subscription, 5.99$ per month for standalone accounts
  // we use it to create a free_trial subscription without accepting payment info
  STANDALONE_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk',
  // other price ids e.g, standalone yearly, team monthly, team yearly
}

/** which version the user accepted when they signed up */
export const TERMS_AND_CONDITION_VERSION = 1;

// DATE
export const MILISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
