const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");

const { getEndpoints } = require("../controllers/api.controller.js");

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
