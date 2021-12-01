const db = require("../db/connection");
const {
  checkSortByExists,
  checkOrderExists,
  dbSearch,
} = require("../utils/utils");

exports.fetchArticle = async (article_id) => {
  const result = await db.query(
    `SELECT articles.*, COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
    [article_id]
  );
  if (result.rows.length === 0) {
    console.log("line17 hello");
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  }
  return result.rows[0];
};

exports.updateArticleVotesById = async (article_id, patchVotesInfo) => {
  const result = await db.query(
    `UPDATE articles SET votes = $1 + votes WHERE article_id = $2 RETURNING *;`,
    [patchVotesInfo, article_id]
  );

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  }
  if (result.rows[0].votes === null) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return result.rows;
};

exports.fetchAllArticles = async (
  sort_by,
  order,
  topic,
  limit = 10,
  p = 1,
  title
) => {
  const offset = (p - 1) * limit;
  const queryValues = [limit, offset];
  const checkedSortBy = await checkSortByExists(sort_by);
  const checkedOrder = await checkOrderExists(order);

  let searchTerm = "";
  if (title) {
    searchTerm = dbSearch("title", title);
  }
  let queryStr = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) 
  AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  ${searchTerm}
  GROUP BY articles.article_id`;

  if (topic) {
    queryValues.push(topic);
    queryStr += ` HAVING articles.topic = $3`;
  }
  queryStr += ` ORDER BY ${checkedSortBy} ${checkedOrder} LIMIT $1 OFFSET $2;`;
  const result = await db.query(queryStr, queryValues);
  return result.rows;
};

exports.updateArticleBodyByArticleId = async (article_id, patchInfo) => {
  const result = await db.query(
    `UPDATE articles SET body = $1  
      WHERE article_id = $2 RETURNING *;`,
    [patchInfo, article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  }
  return result.rows;
};
