module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  "plugins": [
    "react",
  ],
  "rules": {
    "react/jsx-tag-spacing": ["error"],
    "react/jsx-closing-bracket-location": ["error", "line-aligned"]
  },
  "env": {
    "browser": true,
    "node": true,
  }
}
