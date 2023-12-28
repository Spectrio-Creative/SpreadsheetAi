// import { AiTextBox } from './classes/AiTextBox';

// import { loadSpreadsheetActions, removeSpreadsheetAction } from './tools/actionTools';
import { duplicateDocument } from "./tools/duplicate";

// loadSpreadsheetActions();

const _document = duplicateDocument();

// Find layer called "RED HOT BUYS"
// let layer: Layer | undefined;

// document.layers.forEach((l: Layer) => {
//   if (l.name === "RED HOT BUYS") {
//     layer = l;
//   }
// });

// if (layer) {
//   const _newLayer = duplicateLayer(layer, document);
// }

// const layer = app.activeDocument.layers[0];
// layer.name = "Text Playground";

// app.redraw();

// layer.pageItems.forEach((item: PageItem) => {
//   if (item.typename === "TextFrame") {
//     const textBox = new AiTextBox(item as TextFrame, undefined, {});
//     // textBox.replaceMoustaches({ name: "Hello World" });
//     textBox.italicize();
//     // textBox.resizeBox();
//   }
// });

// removeSpreadsheetAction();

app.beep();
