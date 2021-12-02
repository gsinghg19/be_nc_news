const db = require("../db/connection");

exports.fetchCommentsByArticleId = async (article_id) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE comments.article_id = $1`,
    [article_id]
  );
  const articleExists = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (articleExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result.rows;
};

exports.insertCommentByArticleId = async (article_id, newCommentInfo) => {
  const { username, body } = newCommentInfo;

  const articleExists = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  const userExists = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (articleExists.rows.length === 0 || userExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  let result = await db.query(
    `INSERT INTO comments (author, article_id, body) VALUES ($1, $2, $3) RETURNING *;`,
    [username, article_id, body]
  );
  return result.rows;
};

exports.removeCommentByCommentId = async (comment_id) => {
  const result = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id]
  );
  if (result.rows.length !== 0) {
    return result.rows.length[0];
  }
  return Promise.reject({ status: 404, msg: "Not Found" });
};