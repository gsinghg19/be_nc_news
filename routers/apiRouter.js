const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const usersRouter = require("./users-router.js");

const { getEndpoints } = require("../controllers/api.controller.js");

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
