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
  console.log("line12 reaching comment.model_code<<<>>>>");
  if (articleExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result.rows;
};
