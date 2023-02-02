export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('ExcelSimpify') // edit me!
    .addItem('Help', 'openHelpDialog')
    .addItem('Launch Application', 'openAboutSidebar');

  menu.addToUi();
};

export const openHelpDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/help-dialog')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'ExcelSimplify Feedback');
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/sidebar-app').setTitle('ExcelSimplify');
  SpreadsheetApp.getUi().showSidebar(html);
};
