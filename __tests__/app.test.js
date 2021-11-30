const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  test("status:200 responds with descriptions of all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.descriptions);
      });
  });
});
