const express = require("express");
const {
    Register,
    Login,
    getFriendsList,
    addFriend,
    changePicture
} = require("../controllers/userController");

const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/friends", authentication, getFriendsList);
userRouter.put("/addfriend/:friendId", authentication, addFriend);
userRouter.put("/changepicture", authentication, changePicture);

module.exports = userRouter;