module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules:{
    "react-native/no-inline-styles": "off"
  },
  globals:{
    "FileReader": "readonly",
    "IntersectionObserver": "readonly"
  }
};
