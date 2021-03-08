module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    app: "readonly",
    $: "readonly",
    ElementPlacement: "readonly",
    RGBColor: "readonly",
    redraw: "readonly",
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["package.json", "actions/*"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
