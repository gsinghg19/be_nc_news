const { fetchEndpoints } = require("../models/endpoints.api.models");

exports.getEndpoints = async (req, res, next) => {
  try {
    const endpointsShow = await fetchEndpoints();
    res.status(200).send(endpointsShow);
  } catch (err) {
    next(err);
  }
};
