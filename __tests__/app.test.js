const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest", "jest-sorted");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: object with list of endpoints", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(Object.keys(body).length > 1);
  });
  test("404: Invalid URL returns 404 error and message", async () => {
    const res = await request(app).get("/api/madeupapi").expect(404);
    expect(res.body.msg).toBe("Invalid URL");
  });
});
describe("GET /api/topics", () => {
  test("200: Returns all topics available", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics.length).toBeGreaterThan(1);
    body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object, with comment_count added", async () => {
    const article_id = 1;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200);
    expect(body).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(String),
    });
  });
  test("404: valid but non-existent article_id", async () => {
    const { body } = await request(app).get("/api/articles/99999").expect(404);
    expect(body.msg).toBe("Article Not Found");
  });
  test("400: bad article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles/1234455gghhmadeup")
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Accepts update object and responds with updated article", async () => {
    const article_id = 4;
    const articleUpdate = { inc_votes: 25 };
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(200);
    expect(body.article).toMatchObject([
      {
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      },
    ]);
  });
  test("Vote count should increase by 25 to 125 for article_id 1", async () => {
    const article_id = 1;
    const articleUpdate = { inc_votes: 25 };
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate);
    expect(body.article[0].votes).toEqual(125);
  });
  test("404: valid but non-existent article_id", async () => {
    const article_id = 9999;
    const articleUpdate = { inc_votes: 25 };
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(404);
    expect(body.msg).toBe("Article Not Found");
  });
  test("400: bad article_id", async () => {
    const articleUpdate = { inc_votes: 25 };
    const { body } = await request(app)
      .patch("/api/articles/whatabadarticleyouare")
      .send(articleUpdate)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("400: no inc_votes on request body", async () => {
    const article_id = 1;
    const articleUpdate = { inc_nothing: 5 };
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("400: Other property on request body", async () => {
    const article_id = 1;
    const articleUpdate = { inc_votes: 5, favourite_bucket: "medium bucket" };
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles, with comment count added", async () => {
    const { body } = await request(app).get(`/api/articles`).expect(200);
    expect(body.allArticles.length).toBeGreaterThan(0);
    body.allArticles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(String),
      });
    });
  });
  test("200: sorts all articles by date automatically", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.allArticles).toBeSorted({
      key: "created_at",
      descending: true,
    });
  });
  test("200: sorts all by title", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=title")
      .expect(200);
    expect(body.allArticles).toBeSorted({ key: "title", descending: true });
  });
  test("200: sort all article authors in ascending order", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200);
    expect(body.allArticles).toBeSorted({ key: "author", descending: false });
  });
  test("200: Sorts all articles ascending by article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200);
    expect(body.allArticles).toBeSorted({
      key: "article_id",
      descending: false,
    });
  });
  test("200: responds with topics passed by query", async () => {
    const { body } = await request(app)
      .get(`/api/articles?topic=paper`)
      .expect(200);
    body.allArticles.forEach((article) => {
      expect(article.topic).toEqual("paper");
    });
  });
  test("200: responds with valid query but no associated article", async () => {
    const { body } = await request(app)
      .get(`/api/articles?topic=I_like_pizza`)
      .expect(200);
    expect(body.allArticles).toEqual([]);
  });
  test("400: column is not available", async () => {
    const { body } = await request(app)
      .get(`/api/articles?sort_by=me_fail_english_thats_unimpossible`)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("400: the order is neither ascending or descending", async () => {
    const { body } = await request(app)
      .get(`/api/articles?order=lots_of_stuff_going_wrong`)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("200: responds with first 10 articles as default", async () => {
    const { body } = await request(app).get(`/api/articles`).expect(200);
    expect(body.allArticles).toHaveLength(10);
  });
  test("200: responds to the first two articles set by limits", async () => {
    const { body } = await request(app)
      .get(`/api/articles?limit=2`)
      .expect(200);
    expect(body.allArticles).toHaveLength(2);
  });
  test("200: responds to changes to the page query", async () => {
    const { body } = await request(app).get(`/api/articles?p=2`).expect(200);
    expect(body.allArticles).toHaveLength(2);
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for given article", async () => {
    const article_id = 1;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200);
    expect(body.commentsByArticleId.length).toBeGreaterThan(0);
    body.commentsByArticleId.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        body: expect.any(String),
        created_at: expect.any(String),
      });
    });
  });
  test("404: Not Found for empty article", async () => {
    const article_id = 999999;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
  test("400: Bad request for invalid article_id", async () => {
    const article_id = "splatoon";
    const { body } = await request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("200: valid ID, but has no comments responds with empty array", async () => {
    const article_id = 2;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200);

    expect(body.commentsByArticleId).toEqual([]);
  });
});

describe("POST /api/articles/:articles_id/comments", () => {
  test("201: request a body of objects, that responds with the associated posted comment", async () => {
    const article_id = 1;
    const newComment = {
      username: "butter_bridge",
      body: "Test comment 123",
    };
    const { body } = await request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201);
    expect(body.postedComment).toMatchObject([
      {
        comment_id: expect.any(Number),
        article_id: expect.any(Number),
        votes: expect.any(Number),
        body: expect.any(String),
        created_at: expect.any(String),
      },
    ]);
  });
  test("400: responds with Bad Request for invalid id", async () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test comment 123",
    };
    const { body } = await request(app)
      .post(`/api/articles/£@*madeup**@/comments`)
      .send(newComment)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("404: response for non-existing a Id", async () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test comment 123",
    };
    const { body } = await request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
  test("400: Missing required information in fields", async () => {
    const newComment = {
      username: "butter_bridge",
    };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("404: response for username not existing", async () => {
    const newComment = {
      username: "non_existing_username",
      body: "Test comment 123",
    };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: response for deleting comments by comment_id", async () => {
    const comment_id = 1;
    const { body } = await request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204);
    const { commentBody } = await request(app)
      .get(`/api/comments/${comment_id}`)
      .expect(404);
  });
  test("400: responds with Bad Request for an invalid ID", async () => {
    const { body } = await request(app)
      .delete("/api/comments/$*BADREQre4")
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("404: response for non-existing comment_id", async () => {
    const comment_id = 999999;
    const { body } = await request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
});

describe("GET api/users", () => {
  test("200: responds with objects of usernames in an array", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body.allTheUsers.length).toBeGreaterThan(0);
    body.allTheUsers.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
      });
    });
  });
  test("404: responds with 404 error message due to invalid URL", async () => {
    const res = await request(app)
      .get("/api/uz3rs_is_spelled_incorrect")
      .expect(404);
    expect(res.body.msg).toBe("Invalid URL");
  });
});

describe("GET api/users/:username", () => {
  test("200: response is correctly returned with a chosen user object", async () => {
    const { body } = await request(app)
      .get("/api/users/butter_bridge")
      .expect(200);
    expect(body.user).toMatchObject([
      {
        username: expect.any(String),
        avatar_url: expect.any(String),
        name: expect.any(String),
      },
    ]);
  });
  test("400: response for invalid username", async () => {
    const { body } = await request(app)
      .get("/api/users/notAUzz3rYo9")
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Accepts update object and responds with updated comment", async () => {
    const comment_id = 3;
    const commentUpdate = { inc_votes: 100 };
    const { body } = await request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(commentUpdate)
      .expect(200);
    expect(body.comment).toMatchObject([
      {
        body: expect.any(String),
        votes: expect.any(Number),
        author: expect.any(String),
        article_id: expect.any(Number),
        created_at: expect.any(String),
      },
    ]);
  });
});
