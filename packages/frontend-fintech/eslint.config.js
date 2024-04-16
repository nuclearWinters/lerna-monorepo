module.exports = {
  extends: "react-app",
  plugins: ["@stylexjs"],
  rules: {
    "no-console": "error",
    "no-unused-vars": "error",
    "@stylexjs/valid-styles": "error",
  },
  ignores: ["node_modules/*", "build/*", "*.js"],
};
