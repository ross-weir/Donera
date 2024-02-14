/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@donera/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
  },
};
