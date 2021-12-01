const express = require("express");
const articlesRouter = express.Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById);
articlesRouter.route("/:article_id").patch(patchArticleById);

module.exports = articlesRouter;
