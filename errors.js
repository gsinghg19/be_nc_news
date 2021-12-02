exports.handlePsqlError = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.handleCustomsError = (err, req, res, next) => {
  if (err.status && err.msg) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500ServerError = (err, req, res, next) => {
  console.log(err);

  if (process.env.NODE_ENV !== "production") {
    console.log("PARAMS", req.params);
    console.log("QUERY", req.query);
    console.log("BODY", req.body);
    console.log("URL", req.url);
  }
  res.status(500).send({ msg: "Internal server error" });
};
