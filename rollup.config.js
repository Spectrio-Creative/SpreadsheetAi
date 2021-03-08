import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import { string } from "rollup-plugin-string";
import eslint from "@rollup/plugin-eslint";

export default {
  input: "src/main.js",
  output: [
    {
      file: "build/SpreadsheetAi.jsx",
      format: "esm",
    },
  ],
  plugins: [
    eslint({throwOnError: true}),
    nodeResolve(),
    json(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
    string({ include: "actions/*" }),
  ],
};
