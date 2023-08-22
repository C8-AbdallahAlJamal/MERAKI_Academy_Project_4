const express = require("express");
const { createNewPost, removePostById, updatePostById, Like, Unlike } = require("../controllers/postController");
const authentication = require("../middleware/authentication");
postRouter = express.Router();

postRouter.post("/", authentication, createNewPost);
postRouter.delete("/:postId", removePostById);
postRouter.put("/:postId", authentication, updatePostById);
postRouter.put("/:postId/like", authentication, Like);
postRouter.put("/:postId/unlike", authentication, Unlike);

module.exports = postRouter;