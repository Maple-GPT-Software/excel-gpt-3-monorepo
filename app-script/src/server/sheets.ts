/**
 * sheet utility functions that are exported need to be added
 * to index.ts so that they can be used as follows
 * import { serverFunctions } from '../utils/serverFunctions';
 * serverFunction.someUtilityFunction()
 * utils can return a promise if you want to show some loading
 * state while SpreadsheetApp server function is pending
 */

const getSheets = () => SpreadsheetApp.getActive().getSheets();

// returns the sheet the user sees in the UI
const getActiveSheet = () => SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

/**
 * Writes the pass in formula, a string that starts with "=",
 * into the user's selected cell
 */
export const writeFormulaToCell = () => {  
  const activeCell = getActiveSheet().getActiveCell();
  activeCell.setValue('=AVERAGE(range)');
}

/**
 * get formula from the user's selected cell
 */
export const getSelectedCellFormula = () => {
  const activeCellFormula = getActiveSheet().getActiveCell().getFormula();
  return activeCellFormula;
}

export const getActiveSheetRange = () => {
  console.log('get active range start: ')
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRange = sheet.getActiveRange();

  return activeRange.getValues();
}

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

export const addSheet = (sheetTitle: string) => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = (sheetIndex: number) => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = (sheetName: string) => {
  SpreadsheetApp.getActive().getSheetByName(sheetName).activate();
  return getSheetsData();
};
