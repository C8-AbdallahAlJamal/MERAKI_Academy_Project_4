const express = require("express");
const {
    Register,
    Login,
    getFriendsList,
    addFriend,
    changePicture,
    getMyInfo,
    getAllUsers,
    removeFriend,
    getUserInfo
} = require("../controllers/userController");

const authentication = require("../middleware/authentication");
const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/friends", authentication, getFriendsList);
userRouter.put("/addfriend/:friendId", authentication, addFriend);
userRouter.put("/changepicture", authentication, changePicture);
userRouter.get("/:userId", authentication, getMyInfo);
userRouter.get("/all/users", authentication, getAllUsers);
userRouter.put("/removefriend/:friendId", authentication, removeFriend);
userRouter.get("/profile/:userId", authentication, getUserInfo)
module.exports = userRouter;