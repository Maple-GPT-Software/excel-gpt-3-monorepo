/** signed in using signInWithPopUp when user document doesn't exist */
export const USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST';
export const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';

// ========= ROUTES
export const LOGIN_ROUTE = '/login';
export const SIGNUP_ROUTE = '/signup';
export const CHAT_ROUTE = '/chat';

// ========== CHAT CONSTANTS
/** the bot returns formulas in this format so that we can render it nicely in the UI */
export const FORMULA = 'sheet_formula';
export const USER_RANGE = 'cell_range';
export const CSV = 'cell_values';
export const MAXIMUM_ALLOWED_CHARACTERS = 400;
