module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    module: true,
    project: "./tsconfig.json",
  },
  extends: ["@hasparus"],
  ignorePatterns: ["*.js", "dist"],
  rules: {},
};