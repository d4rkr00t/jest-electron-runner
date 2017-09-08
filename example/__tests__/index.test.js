const add = require("../index");

describe("Some test", () => {
  test("should add 1 + 2", () => {
    expect(add(1, 2)).toBe(3);
  });

  test("should add 1 + 1", () => {
    expect(add(1, 1)).toBe(3);
  });

  test("test with snapshot", () => {
    expect({ a: add(1, 2), b: add(3, 4) }).toMatchSnapshot();
  });
});
