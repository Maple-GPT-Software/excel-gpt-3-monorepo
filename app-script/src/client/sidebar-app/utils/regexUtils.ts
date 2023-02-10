import { ALL_TEXT_UP_TO_PROMPT_ENHANCEMENTS, USER_DATA_TABLE_UNTIL_WHITESPACE, USER_FORMULA_UNTIL_WHITESPACE } from "../constants";

/** 
 * Give the following user prompt w enhancements this is how
 * what each of the utility functions will return
 *  this is a test USER_PROMPT_ENHANCEMENTS USER_RANGE=A1:A2 
 *  USER_DATA_TABLE=[["Name"],["Kyle Stone, test"]] USER_FORMULA=AVERAGE(B2:B13)
 */

// =AVERAGE(B2:B13)
export function getFormulaFromText(text: String) {
    let formula = text.match(USER_FORMULA_UNTIL_WHITESPACE);

    if (!formula) {
        return '';
    }

    // we use global regex so match.length === 1
    return formula[0].replace(/USER_FORMULA/g, '');
}

// [["Name"],["Kyle Stone, test"]]
export function getDataTableFromText(text: string) {
    let formula = text.match(USER_DATA_TABLE_UNTIL_WHITESPACE);

    if (!formula) {
        return '';
    }

    // we use global regex so match.length === 1
    // also remove "=" from "=[[:any]]"
    return formula[0].replace(/USER_DATA_TABLE=/g, '');
}

// this is a test
export function getUserPromptFromText(text: string) {
    // match === [this is a test USER_PROMPT_ENHANCEMENTS, this is a test]
    return text.match(ALL_TEXT_UP_TO_PROMPT_ENHANCEMENTS)?.[1] ?? '';
}