const userModel = require("../models/usersSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
    const { firstName, lastName, email, password, picture } = req.body;
    const newUser = new userModel({
        firstName, lastName, email, password, role: "64e3ace64dc89201354c8f7a", friends: [], picture
    })
    try {
        const result = await (await newUser.save()).populate("role");
        res.status(201).json({
            success: true,
            message: "Account Created",
            user: result
        })
    } catch (error) {
        if (error.keyPattern) {
            res.json({
                success: false,
                message: "Account Already Exists",
                error: error.message
            });
        } else {
            res.json({
                success: false,
                message: "Server Error`"
            });
        }
    }

}

const Login = async(req, res) => {
    const { email, password } = req.body;
}

module.exports = {
    Register,
    Login
}