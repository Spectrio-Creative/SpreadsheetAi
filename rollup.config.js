import { nodeResolve } from "@rollup/plugin-node-resolve";
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
    nodeResolve(),
    json(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
    string({ include: "actions/*" }),
  ],
};
