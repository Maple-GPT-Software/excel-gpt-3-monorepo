/**
 * sheet utility functions that are exported need to be added
 * to index.ts so that they can be used as follows
 * import { serverFunctions } from '../utils/serverFunctions';
 * serverFunction.someUtilityFunction()
 * utils can return a promise if you want to show some loading
 * state while SpreadsheetApp server function is pending
 */

const getSheets = () => SpreadsheetApp.getActive().getSheets();

// in a range such as AAB1:AAD4 we want the starting column AAB
const LETTERS_BEFORE_NUMBER_REGEX = /[A-Z]+(?=\d)/;

// returns the sheet the user sees in the UI
const getActiveSheet = () =>
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

/**
 * Writes the pass in formula, a string that starts with "=",
 * into the user's selected cell
 */
export const writeFormulaToCell = (formula: string) => {
  const activeCell = getActiveSheet().getActiveCell();
  activeCell.setValue(formula);
};

/**
 * get formula from the user's selected cell
 */
export const getSelectedCellFormula = () => {
  const activeCellFormula = getActiveSheet().getActiveCell().getFormula();

  return activeCellFormula;
};

interface ValueRangeObj {
  range: string;
  // columns: string[];
  values: string;
}

/**
 * get selected range in as a concatenated string
 * [["2/1/2023","hello,world","1:00:00 AM","2.335"]]
 * we only get display (text values) because
 * something like "1:00:00 AM" in a cell returns "1899-12-30T06:00:00.000Z" with getValues()
 */
export const getSelectedRangeValues = (): ValueRangeObj | null => {
  const activeRange = getActiveSheet().getActiveRange();
  const activeRangeValues = activeRange.getDisplayValues();
  const columnsA1Notation = activeRange.getA1Notation();

  if (!activeRangeValues.length || !columnsA1Notation) null;

  // if activeRangeValues.length > 0, and columnsA1Notation exists, there will be a match
  let firstColumnLetter = columnsA1Notation.match(
    LETTERS_BEFORE_NUMBER_REGEX
  )?.[0] as string;

  let columnLettersArray = incrementStartingFrom(
    firstColumnLetter,
    activeRangeValues[0].length
  ).map((column) => `column ${column}`);

  // add column info to active range
  activeRangeValues.unshift(columnLettersArray);

  // format values in string format
  return {
    range: columnsA1Notation,
    values: JSON.stringify(activeRangeValues),
  };
};

/**
 *
 */

export const getActiveSheetRange = () => {
  console.log('get active range start: ');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRange = sheet.getActiveRange();

  return activeRange.getValues();
};

export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  return getSheets().map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

// UTILITY FUNCTIONS

function incrementString(str: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let i = str.length - 1;

  // Start at the end of the string and find the last non-'Z' character
  // AAZ, i = 2
  while (i >= 0 && str[i] === 'Z') {
    i--;
  }

  // If all characters are 'Z', add a new 'A' at the beginning
  if (i < 0) {
    // ZZ => AA
    return 'A' + 'A'.repeat(str.length);
  }

  // Increment the last non-'Z' character by 1
  const newChar = alphabet[alphabet.indexOf(str[i]) + 1];
  let newStr = str.slice(0, i) + newChar;

  // If there are remaining characters, set them to 'A'
  // if we had AAZ, at this point str = AB, newStr should be ABA
  if (i < str.length - 1) {
    newStr += 'A'.repeat(str.length - i - 1);
  }

  return newStr;
}

// incrementStartingFrom('Y', 5) ==> ["Y", "Z", "AA", "AB", "AC"]
// incrementStartingFrom('ZY', 5) ==> ["ZY", "ZZ", "AAA", "AAB", "AAC"]
/**
 * This function takes in a starting colmun in a range selection, e.g Y
 * and returns of array representing the column headers until the end of
 * the range. E.g if the range is A1:C1 we want ['A', 'B', 'C'] as column
 * headers
 */
function incrementStartingFrom(startCol: string, count: number) {
  let results = [startCol];

  for (let i = 0; i < count - 1; i++) {
    const newStr = incrementString(results[results.length - 1]);
    results.push(newStr);
  }

  return results;
}
