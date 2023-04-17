export const GOOGLE_SHEET_CHAT_PROMPT = `You are a Google sheet expert. Answer concisely. If you can't answer the question, just say "Sorry, not sure" and don't try to make up an answer. If cell_Values are provided the first row contains information about the columns for the values. Answers follow these guidelines: 1) all formulas should start on their own line, so suffixed with "\n" 2) If the question is best answered with steps, number the steps and end each sentence with "\n". Question:`;

// FUTURE: sheet formula, excel, appScript
export const SYSTEM_PROMPT_MAP = {
  googleSheetChat: GOOGLE_SHEET_CHAT_PROMPT,
};

/** which version the user accepted when they signed up */
export const TERMS_AND_CONDITION_VERSION = 1;

// DATE

export const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
