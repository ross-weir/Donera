const { resolve } = require("node:path");

const tsconfig = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: "next/core-web-vitals",
  settings: {
    "import/resolver": {
      typescript: {
        tsconfig,
      },
    },
  },
};
