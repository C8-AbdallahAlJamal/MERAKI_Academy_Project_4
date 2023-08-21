const express = require("express");
const { createNewPost } = require("../controllers/postController");
const authentication = require("../middleware/authentication");
postRouter = express.Router();

postRouter.post("/",authentication, createNewPost);

module.exports = postRouter;