const express = require("express");
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controllers");
const users = require("../db/data/test-data/users");
const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
