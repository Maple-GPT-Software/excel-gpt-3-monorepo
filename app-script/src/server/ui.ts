export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('ExcelSimpify') // edit me!
    .addItem('Help', 'openHelpDialog')
    .addItem('Launch Application', 'openSidebarApplication');

  menu.addToUi();
};

export const openHelpDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/help-dialog')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'ExcelSimplify Feedback');
};

export const openSidebarApplication = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/sidebar-app').setTitle('ExcelSimplify');
  SpreadsheetApp.getUi().showSidebar(html);
};
