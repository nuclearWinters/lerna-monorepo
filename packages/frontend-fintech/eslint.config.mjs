// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import globals from "globals";
import { fixupPluginRules } from "@eslint/compat";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    ignores: ["node_modules/*", "build/*", "*.js", "**/__generated__/*"],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react: eslintPluginReact,
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  }
);
