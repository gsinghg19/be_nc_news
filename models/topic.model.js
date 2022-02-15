const db = require('../db/connection');

exports.showAllTopic = async (topic_name) => {
  const result = await db.query('SELECT * FROM topics WHERE slug = $1', [
    topic_name,
  ]);
  return result.rows[0];
};

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
