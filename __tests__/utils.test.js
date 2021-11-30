const { Test } = require("supertest");
const { conversionFunction } = require("../utils/utils");

describe("conversionFunction", () => {
  test("returns an empty array when passed an empty array", () => {
    const expected = [];
    const actual = conversionFunction([]);

    expect(actual).toEqual(expected);
  });

  // test('returns an array with a keys string value converted to a number, which passes this number as a single object', () => {
  //   const expected = {[]};

  //})
});
