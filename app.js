const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");

const { handlePsqlError, handle500ServerError } = require("./errors");

app.use(express.json());

app.use("/api", router);

app.all("/*", (res, req) => {
  res.statusCode(404).send({ message: "Path not found!" });
});

app.use(handlepsqlError);
app.use(handle500ServerError);

module.exports = app;
