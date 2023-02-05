import {
  onOpen,
  openHelpDialog,
  openAboutSidebar,
} from './ui';

import {
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  writeFormulaToCell,
  getActiveSheetRange,
  getSelectedCellFormula,
  getSelectedRangeValues,
} from './sheets';

// Public functions must be exported as named exports
export {
  onOpen,
  openHelpDialog,
  openAboutSidebar,
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  writeFormulaToCell,
  getActiveSheetRange,
  getSelectedCellFormula,
  getSelectedRangeValues,
};
