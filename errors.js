exports.handlePsqlError = (err, req, res, next) => {
  if (err.code) {
    res.staus(400).send({ message: "Invalid inputs" });
  } else {
    next(err);
  }
};

exports.handle500ServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal server error" });
};
