const express = require("express");
const articlesRouter = express.Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

articlesRouter.route("/").get(getAllArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
