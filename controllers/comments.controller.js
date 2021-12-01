const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByCommentId,
} = require("../models/comments.model");

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

exports.postCommentByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const newCommentInfo = req.body;
    const postedComment = await insertCommentByArticleId(
      article_id,
      newCommentInfo
    );
    res.status(201).send({ postedComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentByCommentId = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    //console.log(req.params);
    const deletedComment = await removeCommentByCommentId(comment_id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
