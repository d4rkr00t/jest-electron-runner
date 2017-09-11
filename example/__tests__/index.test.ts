import { add, useDOMApi, printMe } from "../index";

describe("Some test", () => {
  describe("#add", () => {
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

  describe("#useDOMApi", () => {
    test("should work", () => {
      expect(() => useDOMApi()).not.toThrow();
    });
  });

  describe("#printMe", () => {
    test("shouldn't break transport", () => {
      const msg = "BREAK TRANSPORT!";
      expect(printMe(msg)).toBe(msg);
    });
  });
});
