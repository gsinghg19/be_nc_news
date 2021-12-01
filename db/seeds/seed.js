const db = require("../connection");
const format = require("pg-format");
const {
  formatTopicsData,
  formatUsersData,
  formatArticlesData,
  formatCommentsData,
} = require("../../utils/utils");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return db
    .query("DROP TABLE IF EXISTS topics CASCADE;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS comments CASCADE;");
    })
    .then(() => {
      return db.query(`
    CREATE TABLE topics (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(500) NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      avatar_url TEXT,
      name TEXT NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`
   CREATE TABLE articles (
     article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      body VARCHAR(2000) NOT NULL,
      votes INT DEFAULT 0,
      topic VARCHAR(200) NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR(100) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
   );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(100) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      body TEXT NOT NULL
    );`);
      S;
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO topics
    (slug, description)
    VALUES
    %L
    RETURNING *;
    `,
        formatTopicsData(topicData)
      );
      return db.query(queryStr);
    })
    .then(() => {
      const queryStr = format(
        ` INSERT INTO users
      (username, avatar_url, name)
      VALUES
      %L
      RETURNING *;
      `,
        formatUsersData(userData)
      );
      return db.query(queryStr);
    })
    .then(() => {
      const queryStr = format(
        `
    INSERT INTO articles
    (title, topic, author, body, created_at, votes)
    VALUES
    %L
    RETURNING *;
    `,
        formatArticlesData(articleData)
      );
      return db.query(queryStr);
    })
    .then((result) => {
      const queryStr = format(
        `
    INSERT INTO comments
    (body, votes, author, article_id, created_at)
    VALUES
    %L
    RETURNING *;
    `,
        formatCommentsData(commentData)
      );
      return db.query(queryStr);
    });
};

module.exports = seed;
