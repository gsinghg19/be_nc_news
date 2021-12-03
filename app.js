const express = require("express");
const app = express();
const apiRouter = require("./routers/api.Router");
const {
  handlePsqlError,
  handleCustomsError,
  handle500ServerError,
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);

app.use(handlePsqlError);
app.use(handleCustomsError);
app.use(handle500ServerError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Hello And welcome to my api" });
});

module.exports = app;
