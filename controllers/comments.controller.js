const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByCommentId,
  updateCommentById,
  updateCommentBodyByCommentId,
} = require('../models/comments.model');

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
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

exports.deleteCommentByCommentId = (req, res, next) => {
  removeCommentByCommentId(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
  console.log(req.params.comment_id);
};

exports.patchCommentById = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 1) {
      res.status(400).send({ msg: 'Bad Request' });
    }
    const { comment_id } = req.params;
    let patchInfo = req.body.inc_votes;
    if (req.body.body) {
      patchInfo = req.body.body;
      const updatedComment = await updateCommentBodyByCommentId(
        comment_id,
        patchInfo
      );
      res.status(200).send({ comment: updatedComment });
    } else {
      const updatedComment = await updateCommentById(comment_id, patchInfo);

      res.status(200).send({ comment: updatedComment });
    }
  } catch (err) {
    next(err);
  }
};
