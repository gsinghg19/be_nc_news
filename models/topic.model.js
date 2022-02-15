const db = require('../db/connection');

exports.showAllTopics = async () => {
  let result = await db.query(`SELECT * FROM topics;`);
  return result.rows;
};

exports.insertNewTopic = async (newTopicInfo) => {
  const { slug, description } = newTopicInfo;

  let result = await db.query(
    `INSERT INTO topics (slug, description) VALUES ($1, $2)
        RETURNING *;`,
    [slug, description]
  );

  return result.rows[0];
};
