

/** signed in using signInWithPopUp when user document doesn't exist */
export const USER_DOES_NOT_EXIST = "USER_DOES_NOT_EXIST";
export const USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS";

// ========= ROUTES
export const LOGIN_ROUTE = "/login";
export const SIGNUP_ROUTE = "/signup";
export const CHAT_ROUTE = "/chat";


// ========== CHAT CONSTANTS
/** 
 * This is how we specify parts of the message that
 * should be in a code block
 */
export const CODE_BLOCK = 'CODE_BLOCK';
export const USER_FORMULA = 'USER_FORMULA';
export const USER_RANGE = 'USER_RANGE';
export const USER_DATA_TABLE = 'USER_DATA_TABLE';
// the start of data table and/or formula. The user can add
// either, both or none so we use this reference to get only
// the user's text
export const USER_PROMPT_ENHANCEMENTS = 'USER_PROMPT_ENHANCEMENTS';

//============ REGEXES
// some string USER_DATA_TABLE=[["Name"],["Kyle Stone, test"]] -> USER_DATA_TABLE=[["Name"],["Kyle Stone, test"]]
export const USER_DATA_TABLE_UNTIL_WHITESPACE = /USER_DATA_TABLE=\[\[.*\]\]/g;
// some string USER_FORMULA=AVERAGE(B2:B13) -> USER_FORMULA=AVERAGE(B2:B13)
export const USER_FORMULA_UNTIL_WHITESPACE = /USER_FORMULA=[^\s]+:[^\s]+/g;
// some string USER_PROMPT_ENHANCEMENTS -> [some string USER_PROMPT_ENHANCEMENTS, some string]
export const ALL_TEXT_UP_TO_PROMPT_ENHANCEMENTS = /^(.*)\sUSER_PROMPT_ENHANCEMENTS/;

