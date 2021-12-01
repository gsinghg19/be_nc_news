const db = require("../db/connection");
const fsPromises = require("fs").promises;

exports.fetchEndpoints = async () => {
  const data = await fsPromises
    .readFile("./endpoints.json", "utf8")
    .catch((err) => console.log("failed to read"));
  return JSON.parse(data.toString());
};
