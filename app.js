const express = require("express");
const app = express();
const apiRouter = require("./routers/api.Router");

const {
  handlePsqlError,
  handle500ServerError,
  handleCustomsError,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use(handlePsqlError);
app.use(handle500ServerError);
app.use(handleCustomsError);

module.exports = app;
