const topicsRouter = require("express").Router();
const {
  getTopics,
  getTopicById,
} = require("../controllers/topics.controllers");

topicsRouter.get("/", getTopics);
topicsRouter.get("/:slug", getTopicById);

module.exports = topicsRouter;
