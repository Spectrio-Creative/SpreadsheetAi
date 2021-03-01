import json from "@rollup/plugin-json";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import { string } from "rollup-plugin-string";

export default {
  input: "src/main.js",
  output: [
    {
      file: "build/SpreadsheetAi.jsx",
      format: "esm",
    },
  ],
  plugins: [
    json(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
    string({ include: "actions/*" }),
  ],
};
