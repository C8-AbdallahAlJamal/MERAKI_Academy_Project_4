const express = require("express");
const { createNewPost, removePostById } = require("../controllers/postController");
const authentication = require("../middleware/authentication");
postRouter = express.Router();

postRouter.post("/", authentication, createNewPost);
postRouter.delete("/:postId", removePostById);

module.exports = postRouter;