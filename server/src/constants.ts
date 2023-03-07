export const BASE_PROMPT = `Answer this google sheets question. Be concise. Include explanations if they are helpful. If you can't answer the question, only answer with "Sorry, not sure" and end answer. Follow these guidelines: 1) If explicitly asked for a formula only, only answer with a formula and no explanation 2) formulas should be on their own line and start with FORMULA_BLOCK= and end with "\n" 3) Only include formulas in your answer if needed 4) If the question is best answered with steps, number the steps and end each sentence with "\n".`;

// these price ids created in the Stripe dashboard UI
export enum PRICE_IDS {
  // this is the price_id for the premium subscription, 5.99$ per month for standalone accounts
  // we use it to create a free_trial subscription without accepting payment info
  STANDALONE_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk',
  // other price ids e.g, standalone yearly, team monthly, team yearly
}

/** which version the user accepted when they signed up */
export const TERMS_AND_CONDITION_VERSION = 1;
