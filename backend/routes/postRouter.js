const express = require("express");
const { createNewPost, removePostById, updatePostById, Like, Unlike, addComment, removeComment } = require("../controllers/postController");
const authentication = require("../middleware/authentication");
postRouter = express.Router();

postRouter.post("/", authentication, createNewPost);
postRouter.delete("/:postId", removePostById);
postRouter.put("/:postId", authentication, updatePostById);
postRouter.put("/:postId/like", authentication, Like);
postRouter.put("/:postId/unlike", authentication, Unlike);
postRouter.post("/:postId/comment", authentication, addComment);
postRouter.delete("/:postId/:commentId", authentication, removeComment);

module.exports = postRouter;