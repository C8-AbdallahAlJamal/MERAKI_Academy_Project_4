const express = require("express");
const { createNewPost } = require("../controllers/postController");

postRouter = express.Router();

postRouter.post("/", createNewPost);

module.exports = postRouter;