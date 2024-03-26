const sum = require("../app/Jest/sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

//npx jest sum.test.js
