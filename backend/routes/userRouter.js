const express = require("express");
const {
    Register,
    Login,
    getFriendsList
} = require("../controllers/userController");

const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/friends", authentication, getFriendsList);

module.exports = userRouter;