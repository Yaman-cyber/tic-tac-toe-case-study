module.exports = {
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",
  setupFiles: ["./tests/setup-tests.js"],
  moduleFileExtensions: ["js", "json", "jsx", "node", "mjs"],
  transform: {},
};
