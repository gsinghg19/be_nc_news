const { showAllTopics, insertNewTopic } = require("../models/topic.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await showAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postNewTopic = async (req, res, next) => {
  try {
    const newTopicInfo = req.body;
    const newTopic = await insertNewTopic(newTopicInfo);
    res.status(201).send({ newTopic });
  } catch (err) {
    next(err);
  }
};
