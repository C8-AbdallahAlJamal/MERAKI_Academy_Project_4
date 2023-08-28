const express = require("express");
const {
    Register,
    Login,
    getFriendsList,
    addFriend,
    changePicture,
    getUserInfo,
    getAllUsers, removeFriend
} = require("../controllers/userController");

const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/friends", authentication, getFriendsList);
userRouter.put("/addfriend/:friendId", authentication, addFriend);
userRouter.put("/changepicture", authentication, changePicture);
userRouter.get("/:userId", authentication, getUserInfo);
userRouter.get("/all/users", authentication, getAllUsers);
userRouter.put("/removefriend/:friendId", authentication, removeFriend);
module.exports = userRouter;