const db = require("../db/connection");

exports.fetchUsers = async () => {
  const result = await db.query("SELECT username FROM users");
  return result.rows;
};

exports.fetchUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1;", [
    username,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return result.rows;
};
