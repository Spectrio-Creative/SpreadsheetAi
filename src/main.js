import convertObj from "./convertObj";
import { createLayer } from "./createLayer";

const myFile = File.openDialog("Please select CSV Spreadsheet.");

if (myFile != null) {
  // open file
  var fileOK = myFile.open("r"),
    fileObj = [],
    fileObj2 = "";
  if (fileOK) {
    var text;
    while (!myFile.eof) {
      text = myFile.readln();
      fileObj2 += text + "\\n";
    }

    fileObj = fileObj2
      .slice(0, -2)
      .replace(/,(?!(?:[^"]|"[^"]*")*$)/g, "\\;")
      .replace(/\\n(?!(?:[^"]|"[^"]*")*$)/g, "\\m")
      .split(/\\n/g);

    fileObj = convertObj(fileObj);

    for (var i = 0; i < fileObj.length; i++) {
    //   for (key in fileObj[i]) {
    //     alert(key + ": " + fileObj[i][key]);
    //   }
      createLayer(fileObj[i], i);
    }

    myFile.close();
  } else {
    alert("File open failed!");
  }
} else {
  alert("No CSV file selected.");
}
