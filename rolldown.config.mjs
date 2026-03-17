// import { nodeResolve } from "@rollup/plugin-node-resolve";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
// import eslint from "@rollup/plugin-eslint";
import typescript from "@rollup/plugin-typescript";
import strip from "strip-comments";

function stripComments() {
  return {
    name: "remove-comments",
    transform(code) {
      return {
        code: strip(code),
        map: null,
      };
    },
  };
}

export default {
  input: process.env.ENTRY || "src/main.ts",
  moduleTypes: {
    ".aia": "text",
  },
  output: {
    file: process.env.OUTPUT || "build/SpreadsheetAi.jsx",
    format: "esm",
    sourcemap: false,
  },
  plugins: [
    typescript(),
    // eslint({throwOnError: true}),
    // nodeResolve(),
    getBabelOutputPlugin({ presets: ["extendscript"] }),
    stripComments(),
  ],
};
