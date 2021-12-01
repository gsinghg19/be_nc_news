const {
  formatTopicsData,
  formatUsersData,
  formatArticlesData,
  formatCommentsData,
  checkSortByExists,
  checkOrderExists,
  dbSearch,
} = require("../utils/utils");

describe("formatTopicsData", () => {
  test("returns an empty array for no data", () => {
    const topicData = [];
    const expectedFormattedData = [];
    expect(formatTopicsData(topicData)).toEqual(expectedFormattedData);
  });
  test("returns nested arrays in the order (username, comment, rating, game_id)", () => {
    const topicData = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
    ];
    const expectedFormattedData = [["mitch", "The man, the Mitch, the legend"]];
    expect(formatTopicsData(topicData)).toEqual(expectedFormattedData);
  });
  test("does not mutate the original topicData", () => {
    const topicData = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
    ];
    const unMutatedRows = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
    ];
    formatTopicsData(topicData);
    expect(topicData).toEqual(unMutatedRows);
  });
});
describe("formatUsersData", () => {
  test("returns an empty array for no data", () => {
    const userData = [];
    const expectedFormattedData = [];
    expect(formatUsersData(userData)).toEqual(expectedFormattedData);
  });
  test("returns nested arrays in the order (username, avatar_url, name)", () => {
    const userData = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    ];
    const expectedFormattedData = [
      [
        "butter_bridge",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        "jonny",
      ],
    ];
    expect(formatUsersData(userData)).toEqual(expectedFormattedData);
  });
  test("does not mutate the original userData", () => {
    const userData = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    ];
    const unMutatedRows = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    ];
    formatUsersData(userData);
    expect(userData).toEqual(unMutatedRows);
  });
});
describe("formatArticlesData", () => {
  test("returns an empty array for no data", () => {
    const articleData = [];
    const expectedFormattedData = [];
    expect(formatArticlesData(articleData)).toEqual(expectedFormattedData);
  });
  test("returns nested arrays in the order (title, topic, author, body, created_at, votes)", () => {
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ];
    const expectedFormattedData = [
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
      ],
    ];
    expect(formatArticlesData(articleData)).toEqual(expectedFormattedData);
  });
  test("does not mutate the original articleData", () => {
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ];
    const unMutatedRows = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ];
    formatArticlesData(articleData);
    expect(articleData).toEqual(unMutatedRows);
  });
});
describe("formatCommentsData", () => {
  test("returns an empty array for no data", () => {
    const commentData = [];
    const expectedFormattedData = [];
    expect(formatCommentsData(commentData)).toEqual(expectedFormattedData);
  });
  test("returns nested arrays in the order (comment_id, body, votes, author, article_id, created_at)", () => {
    const commentData = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
    ];
    const expectedFormattedData = [
      [
        `Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!`,
        16,
        "butter_bridge",
        9,
        new Date(1586179020000),
      ],
    ];
    expect(formatCommentsData(commentData)).toEqual(expectedFormattedData);
  });
  test("does not mutate the original reviewData", () => {
    const commentData = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
    ];
    const unMutatedRows = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
    ];
    formatCommentsData(commentData);
    expect(commentData).toEqual(unMutatedRows);
  });
});
describe("checkSortByExists", () => {
  test("empty input passes created_at by default", () => {
    expect(checkSortByExists()).toBe("created_at");
  });
  test("Valid input returns input", () => {
    expect(checkSortByExists("author")).toBe("author");
  });
  test("Invalid input returns rejected", () => {
    expect(checkSortByExists("awfurs")).rejects.toEqual({
      msg: "Bad Request",
      status: 400,
    });
  });
});

describe("checkOrderExists", () => {
  test("empty input passed DESC by default", () => {
    expect(checkOrderExists()).toBe("DESC");
  });
  test("valid input is passed through", async () => {
    expect(checkOrderExists("asc")).toBe("ASC");
  });
  test("Invalid input returns rejected", async () => {
    expect(checkOrderExists("UPPITY")).rejects.toEqual({
      msg: "Bad Request",
      status: 400,
    });
  });
});
describe("dbSearch", () => {
  test("insert parameters into search string and return", () => {
    const column = "title";
    const search = "Vanilla Slice";
    const expectedOutput = `WHERE title @@ to_tsquery('Vanilla Slice')`;
    expect(dbSearch(column, search)).toEqual(expectedOutput);
  });
});
