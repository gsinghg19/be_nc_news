const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db.query(`DROP TABLE IF EXISTS comments`).then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`).then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`).then(() => {
        return db
          .query(`DROP TABLE IF EXISTS users`)
          .then(() => {
            return db.query(
              `CREATE TABLE users(
            username VARCHAR PRIMARY KEY NOT NULL,
            avatar_url VARCHAR,
            name VARCHAR
          );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE topics(
                slug VARCHAR PRIMARY KEY NOT NULL,
                description VARCHAR
              );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE articles(
                  article_id SERIAL PRIMARY KEY,
                  title VARCHAR NOT NULL,
                  body VARCHAR NOT NULL,
                  votes INT DEFAULT 0,
                  topic VARCHAR REFERENCES topics(slug),
                  author VARCHAR REFERENCES users(username) NOT NULL,
                  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE comments(
                  comment_id SERIAL PRIMARY KEY,
                  author VARCHAR REFERENCES users(username) NOT NULL,
                  article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
                  votes INT DEFAULT 0,
                  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                  body VARCHAR NOT NULL
                )`
            );
          })

          .then(() => {
            const queryStr = format(
              `INSERT INTO users(username, avatar_url, name)
            VALUES %L;`,
              userData.map((user) => {
                return [user.username, user.avatar_url, user.name];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO topics(slug, description)
            VALUES %L;`,
              topicData.map((topic) => {
                return [topic.slug, topic.description];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO articles(
                title,
                body,
                votes,
                topic,
                author,
                created_at)
            VALUES %L;`,
              articleData.map((article) => {
                return [
                  article.title,
                  article.body,
                  article.votes,
                  article.topic,
                  article.author,
                  article.created_at,
                ];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO comments(
                author,
                article_id,
                votes,
                created_at,
                body)
            VALUES %L;`,
              commentData.map((comment) => {
                return [
                  comment.author,
                  comment.article_id,
                  comment.votes,
                  comment.created_at,
                  comment.body,
                ];
              })
            );
            return db.query(queryStr);
          });
      });
    });
  });
};

module.exports = seed;
