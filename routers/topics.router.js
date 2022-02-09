const express = require("express");
const topicsRouter = express.Router();
const {
  getTopics,
  postNewTopic,
} = require("../controllers/topics.controllers");

topicsRouter.route("/").get(getTopics).post(postNewTopic);

module.exports = topicsRouter;
