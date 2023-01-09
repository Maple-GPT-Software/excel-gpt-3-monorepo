/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ByeService from './services/bye.service';
import HelloService from './services/hello.service';

// @ts-ignore
function main(): void {
  const hiMessage = HelloService.sayHi('CLASP');
  const byeMessage = ByeService.sayBye('CLASP');

  console.log({ hiMessage, byeMessage });
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Excel Simplify')
    .addItem('Open In Sidemenu', 'customSidebar')
    .addToUi();
}

function customSidebar() {
  const html = HtmlService.createTemplateFromFile('app/index').evaluate();
  html.setTitle('Excel Simplify');
  SpreadsheetApp.getUi().showSidebar(html);
}
