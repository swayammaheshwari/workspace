const sum = require("../app/Jest/subtract");

test("subtract 3 from 2 to equal 1", () => {
  expect(sum(3, 2)).toBe(1);
});

//npx jest sum.test.js
