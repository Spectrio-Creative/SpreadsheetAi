export function splitIntoLines(text: string) {
  const out = [];
  let line = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (character === "\n" && !inQuote) {
      out.push(line);
      line = "";
      continue;
    } 
    
    if (character === '"') {
      if (inQuote) inQuote = false;
      else inQuote = true;
    }
    line += character;
  }

  return out;
}

// Split csv text into an array of fields, note that two "" in a row is an escaped quote
export function split(text: string, delimiter: string) {
  // text = text.replaceAll('\\"', '""');
  const out = [];
  let field = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (character === delimiter && !inQuote) {
      out.push(field);
      field = "";
    } else if (character === '"') {
      if (inQuote) {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        inQuote = true;
      }
    } else {
      field += character;
    }
  }
  out.push(field);
  return out;
}

export interface FromCSVArgs {
  data: string;
  separator?: string;
  headerFields?: string[];
  overrideExistingHeader?: boolean;
  parseFloats?: boolean;
  skipEmptyLines?: boolean;
  commentPrefix?: string;
}

export function fromCSV({
  data,
  separator = ",",
  headerFields,
  overrideExistingHeader,
  parseFloats = true,
  skipEmptyLines = true,
  commentPrefix,
}: FromCSVArgs) {
  function load(data: string) {
    data = data.replaceAll("\r\n", "\n");
    const lines = splitIntoLines(data);
    // const lines = data.split("\n");
    let headers = [];
    if (!headerFields) {
      const head = lines.shift();
      headers = split(head, separator).map((e) => e.replace("#", ""));
    } else {
      if (overrideExistingHeader) lines.shift();
      headers = headerFields;
    }
    const out = [];
    for (const line of lines) {
      if (skipEmptyLines && !line) continue;
      if (commentPrefix && line.startsWith(commentPrefix)) continue;
      const row = split(line, separator);
      const obj = {};
      for (const i in headers) {
        let val = row[i];
        if (parseFloats && !isNaN(val)) {
          const floatVal = parseFloat(val);
          if (floatVal.toString() === row[i]) val = floatVal;
        }
        obj[headers[i]] = val;
      }
      out.push(obj);
    }
    return {
      toJSON: () => out,
      toMarkdown: () => toMarkdown(out),
    };
  }
  if (data) return load(data);
  else {
    throw new Error("Must provide either data or file argument");
  }
}

function toMarkdown(data: { [key: string]: string }[]) {
  const headers = Object.keys(data[0]);
  const out = [];
  out.push(headers.join("|"));
  out.push(headers.map(() => "---").join("|"));
  for (const row of data) {
    out.push(headers.map((h) => row[h]).join("|"));
  }
  return out.join("\n");
}

// function withDir(root) {
//   const openCSV = (fileName, options) =>
//     fromCSV({ file: join(root, fileName), separator: ",", ...options }).toJSON();
//   const openTSV = (fileName, options) =>
//     fromCSV({ file: join(root, fileName), separator: "\t", ...options }).toJSON();
//   return { openCSV, openTSV };
// }

// module.exports = {
//   fromCSV,
//   withDir,
// };
