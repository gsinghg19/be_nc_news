const db = require("../db/connection");
const {
  selectArticleByIdQueryStr,
  selectArticlesQueryStr,
} = require("../utils/utils");

exports.selectArticleById = async (article_id) => {
  const { rows } = await db.query(selectArticleByIdQueryStr, [article_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "article not found",
    });
  }
  //console.log("line 12 <<<<<>>>>>>>");
  return rows[0];
};

exports.updateArticleById = async (article_id, updatedArticle) => {
  const { inc_votes } = updatedArticle;
  const keyArr = Object.keys(updatedArticle);

  if (keyArr.length === 0) {
    return Promise.reject({
      status: 400,
      message: "missing required fields",
    });
  } else if (keyArr.length !== 1) {
    return Promise.reject({
      status: 400,
      message: "apply updates",
    });
  } else if (
    !keyArr.includes("inc_votes") ||
    typeof updatedArticle.inc_votes !== "number"
  ) {
    return Promise.reject({
      status: 400,
      message: "incorrect type",
    });
  }
  const query =
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;";
  const { rows } = await db.query(query, [article_id, inc_votes]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 400,
      message: "article does not exist",
    });
  } else return rows[0];
};
