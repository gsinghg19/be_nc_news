const { selectTopics, selectTopicById } = require("../models/topic.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getTopicById = (req, res, next) => {
  const { slug } = req.params;
  selectTopicById(slug)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};
