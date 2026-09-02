export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "off"
    }
  }
];
