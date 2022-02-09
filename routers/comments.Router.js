const express = require("express");
const commentsRouter = express.Router();

const {
  patchCommentById,
  deleteCommentByCommentId,
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentByCommentId);

module.exports = commentsRouter;
