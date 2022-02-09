const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/api.Router");
const {
  handlePsqlError,
  handleCustomsError,
  handle500ServerError,
} = require("./errors");

const app = express();
app.use(express.json());

//cross origin resource sharing
app.use(cors());

app.use("/api", apiRouter);

// Error handlers
app.use(handlePsqlError);
app.use(handleCustomsError);
app.use(handle500ServerError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

module.exports = app;
