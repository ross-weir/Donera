const { resolve } = require("node:path");

const tsconfig = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  settings: {
    "import/resolver": {
      typescript: {
        tsconfig,
      },
    },
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
};
