import { duplicateDocument } from "../tools/duplicate";

export const templateDocument = app.activeDocument;
export const templatePath = templateDocument.path;
export let document: Document;

export const createDocument = () => {
  document = duplicateDocument();
};

export const assignDocument = (doc: Document) => {
  document = doc;
};