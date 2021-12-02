const express = require("express");
const apiRouter = express.Router();
const articlesRouter = require("./articles.router");
const topicsRouter = require("./topics.router");
const commentsRouter = require("./comments.Router");

const { getEndpoints } = require("../controllers/api.controller.js");
const usersRouter = require("./users.router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
