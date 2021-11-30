const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articles.controllers");

articlesRouter.get("/", getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
