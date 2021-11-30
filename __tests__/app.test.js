const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  test("status:200 responds with descriptions of all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.descriptions["GET /api"]).toEqual({
          description: "Provides json of all the available api's endpoints",
        });
      });
  });

  test("status:404 responds with an error message", () => {
    return request(app)
      .get("/api/no-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("path not found");
      });
  });

  describe("GET /api/topics", () => {
    test("status:200 responds with an array of objects with the propertires of description and slug", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });

    test("status:404 responds with an error message", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("path not found");
        });
    });
  });

  describe("GET /api/topics:slug", () => {
    test("status:200 responds with an array of objects which have slug and description properties", () => {
      return request(app)
        .get("/api/topics/mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.topic).toEqual({
            slug: "mitch",
            description: "The man, the Mitch, the legend",
          });
        });
    });
    test("status: 404, respond with an error message", () => {
      return request(app)
        .get("/api/topics/mitch")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("topic not found");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {});
});
