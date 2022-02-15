const { showAllTopics, insertNewTopic } = require('../models/topic.model');

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
    console.log(req.body);
    const newTopic = await insertNewTopic(newTopicInfo);
    console.log(insertNewTopic);
    res.status(201).send({ newTopic });
    console.log(res);
  } catch (err) {
    next(err);
  }
};

// exports.postNewTopic = async (req, res, next) => {
//   try {
//     const { slug, description } = req.body;

//     if (slug && description) {
//       const topic = await insertNewTopic(slug, description);

//       res.status(201).send({ topic });
//     } else {
//       next({ status: 400, msg: 'Articles: Incorrect slug and/or description' });
//     }
//   } catch (err) {
//     next(err);
//   }
// };
