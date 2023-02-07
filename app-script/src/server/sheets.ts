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

interface ValueRangeObj {
  range: string,
  values: string
}

/**
 * get selected range in as a concatenated string
 * [["2/1/2023","hello,world","1:00:00 AM","2.335"]]
 * we only get display (text values) because
 * something like "1:00:00 AM" in a cell returns "1899-12-30T06:00:00.000Z" with getValues()
 */
export const getSelectedRangeValues = () : ValueRangeObj | null => {
  const activeRange = getActiveSheet().getActiveRange();
  const activeRangeValues = activeRange.getDisplayValues();

  if (!activeRangeValues.length) null;

  // format values in string format
  return {
    range: activeRange.getA1Notation(),
    values: JSON.stringify(activeRangeValues)
    // values: convertRangeValuesToCSV(activeRangeValues)
  };
}

/**
 * 
 */

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


// UTILITY FUNCTIONS

/**
 * takes in values, an array of nested arrays where each nested array
 * is a row. We convert this into CSV format.
 */
function convertRangeValuesToCSV(values: Array<string | number>[]) {
  return values.reduce((csv, row) => {
    const rowWithFixedDecimals = row.map((el) => {
      if (typeof el === 'number') {
        return el.toFixed(2);
      } else {
        return el;
      }
    });
    return csv + `\n` + rowWithFixedDecimals.join(',');
  }, '').concat('\n')
}

/**
 * Convert any spreadsheet value to a date.
 * Assumes that numbers are using Epoch (days since 1 Jan 1900, e.g. Excel, Sheets).
 * 
 * @param {object}  value  (optional) Cell value; a date, a number or a date-string 
 *                         will be converted to a JavaScript date. If missing or
 *                         an unknown type, will be treated as "today".
 *
 * @return {date}          JavaScript Date object representation of input value.
 */
// function convert2jsDate( value : Number | Boolean | Object 
//   | String ) {
//   let jsDate;  // default to now
//   if (value) {
//     // If we were given a date object, use it as-is
//     if (typeof value === 'object') {
//       jsDate = new Date(value);
//     }
//     else {
//       if (typeof value === 'number') {
//         // Assume this is spreadsheet "serial number" date
//         var daysSince01Jan1900 = value;
//         var daysSince01Jan1970 = daysSince01Jan1900 - 25569 // 25569 = days TO Unix Time Reference
//         var msSince01Jan1970 = daysSince01Jan1970 * 24 * 60 * 60 * 1000; // Convert to numeric unix time
//         var timezoneOffsetInMs = jsDate.getTimezoneOffset() * 60 * 1000;
//         jsDate = new Date( msSince01Jan1970 + timezoneOffsetInMs );
//       }
//       else if (typeof value === 'string') {
//         // Hope the string is formatted as a date string
//         jsDate = new Date( value );
//       }
//     }
//   }
//   return jsDate;
// }