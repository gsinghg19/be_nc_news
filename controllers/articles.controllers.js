const {
  fetchArticle,
  updateArticleVotesById,
  updateArticleBodyByArticleId,
  fetchAllArticles,
} = require('../models/article.models');

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    console.log(article_id);
    const articleItem = await fetchArticle(article_id);
    res.status(200).send(articleItem);
  } catch (err) {
    next(err);
  }
};
exports.patchArticleById = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 1) {
      res.status(400).send({ msg: 'Bad Request' });
    }
    const { article_id } = req.params;
    let patchInfo = req.body.inc_votes;
    if (req.body.body) {
      patchInfo = req.body.body;
      const updatedArticle = await updateArticleBodyByArticleId(
        article_id,
        patchInfo
      );
      res.status(200).send({ article: updatedArticle });
    } else {
      const updatedArticle = await updateArticleVotesById(
        article_id,
        patchInfo
      );
      res.status(200).send({ article: updatedArticle });
    }
  } catch (err) {
    next(err);
  }
};
exports.getAllArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic, limit, p, title } = req.query;

    const allArticles = await fetchAllArticles(
      sort_by,
      order,
      topic,
      limit,
      p,
      title
    );
    res.status(200).send({ allArticles });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    //console.log("line6<<<<>>>>", req);
    const commentsByArticleId = await fetchCommentsByArticleId(article_id);
    res.status(200).send({ commentsByArticleId });
  } catch (err) {
    next(err);
  }
};
