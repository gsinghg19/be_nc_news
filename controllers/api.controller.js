const { getJsonDescriptions } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  getJsonDescriptions()
    .then((descriptions) => {
      res.status(200).send({ descriptions });
    })
    .catch(next);
};
