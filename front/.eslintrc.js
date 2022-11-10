module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/jsx-runtime",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    settings: {
        react: {
            pragma: "React",
        },
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        // "linebreak-style": ["error", "windows"],
        "linebreak-style": "off",
        semi: ["error", "always"],
        "no-duplicate-imports": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        // "no-unused-vars": "error",
        "@typescript-eslint/no-unused-vars": "error",
    },
    ignorePatterns: ["config/**/*"],
};
