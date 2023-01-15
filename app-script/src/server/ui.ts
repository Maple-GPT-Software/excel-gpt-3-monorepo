export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('ExcelSimp') // edit me!
    .addItem('Sheet Editor', 'openDialog')
    .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap')
    .addItem('Open Application', 'openAboutSidebar');

  menu.addToUi();
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/dialog-demo')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor');
};

export const openDialogBootstrap = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/dialog-demo-bootstrap')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Bootstrap)');
};


export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('dist/sidebar-app').setTitle('ExcelSimplify');
  SpreadsheetApp.getUi().showSidebar(html);
};
