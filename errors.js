exports.handlePsqlError = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ message: "Invalid inputs" });
  } else {
    next(err);
  }
};

exports.handleCustomsError = (err, req, res, next) => {
  if (err.status && err.message) {
    const { status, message } = err;
    res.status(status).send({ message });
  } else {
    next(err);
  }
};

exports.handle500ServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal server error" });
};
