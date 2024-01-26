import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import { string } from "rollup-plugin-string";
// import eslint from "@rollup/plugin-eslint";
import typescript from "@rollup/plugin-typescript";
import stripComments from "./plugins/strip";

export default {
  input: process.env.ENTRY || "src/main.ts",
  output: {
    file: process.env.OUTPUT || "build/SpreadsheetAi.jsx",
    format: "esm",
    sourcemap: false
  },
  plugins: [
    typescript(),
    // eslint({throwOnError: true}),
    nodeResolve(),
    json(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
    string({ include: "actions/*" }),
    stripComments()
  ],
};
