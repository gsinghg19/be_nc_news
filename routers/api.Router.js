const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");

const { getEndpoints } = require("../controllers/api.controller.js");

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
