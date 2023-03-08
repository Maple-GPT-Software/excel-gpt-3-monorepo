export const BASE_PROMPT = `Answer this google sheets question. If unsure, respond with "Sorry, not sure". Follow these guidelines: 1) If explicitly asked for a formula, only answer with formula starting with %FORMULA%=. 2) If the question is best answered with steps/explanation, number the steps/explanation and end each sentence with "\n".`;

// these price ids created in the Stripe dashboard UI
export enum PRICE_IDS {
  // this is the price_id for the premium subscription, 5.99$ per month for standalone accounts
  // we use it to create a free_trial subscription without accepting payment info
  STANDALONE_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk',
  // other price ids e.g, standalone yearly, team monthly, team yearly
}
