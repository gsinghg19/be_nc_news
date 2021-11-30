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

  describe("GET /api/articles/:article_id", () => {
    test("GET, status:200 responds with a single matching article", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T14:14:00.000Z",
            votes: 0,
            comment_counts: 2,
          });
        });
    });
    test("GET status:404 responds with an error message", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("article does not exist");
        });
    });
    test("GET status:400 responds with an error message", () => {
      return request(app)
        .get("/api/articles/no-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid inputs");
        });
    });
  });

  describe("PATCH /api/articles/:articles_id", () => {
    test("PATCH status: 200 responds with the updated article", () => {
      const updateVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/5")
        .send(updateVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T14:14:00.000Z",
            votes: 1,
          });
        });
    });

    test("PATCH status: 400 responds with an error message", () => {
      const updateVotes = { inc_votes: "placed error in votes>>>>>>" };
      return request(app)
        .patch("/api/articles/5")
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("incorrect type");
        });
    });
  });
});
