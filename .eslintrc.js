module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    node: true,
    es2021: true,
  },
  globals: {
    app: "readonly",
    $: "readonly",
    ElementPlacement: "readonly",
    RGBColor: "readonly",
    redraw: "readonly",
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["package.json", "actions/*", "build/*", "dist/*"],
  rules: {
    indent: ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    // quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-control-regex": 0,
    "no-inner-declarations": "warn",
    "no-useless-escape": "warn",
    "no-misleading-character-class": "warn",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": "off",
  },
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
