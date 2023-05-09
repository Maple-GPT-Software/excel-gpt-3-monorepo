export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('ExcelSimpify')
    .addItem('Launch Application', 'openSidebarApplication');

  menu.addToUi();
};

export const openSidebarApplication = () => {
  const html =
    HtmlService.createHtmlOutputFromFile('dist/sidebar-app').setTitle(
      'ExcelSimplify'
    );
  SpreadsheetApp.getUi().showSidebar(html);
};
