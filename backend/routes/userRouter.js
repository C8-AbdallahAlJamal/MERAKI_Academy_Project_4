const express = require("express");
const {
    Register,
    Login
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);

module.exports = userRouter;