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

const Login = async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();
    try {
        const result = await userModel.findOne({ email });
        if (result) {
            const valid = await bcrypt.compare(password, result.password);
            if (valid) {
                const payload = {
                    userId: result._id,
                    role: result.role,
                }
                const options = {
                    expiresIn: "60m"
                }
                const token = jwt.sign(payload, process.env.SECRET, options);
                res.json({
                    success: true,
                    token: token
                })
            } else {
                res.json({
                    success: false,
                    message: "The email doesn't exist or the password you entered is wrong"
                })
            }
        } else {
            res.json({
                success: true,
                message: "The email doesn't exist or the password you entered is wrong"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

const addFriend = async (req, res) => {
    const { friendId } = req.params;
    const { userId } = req.token;

    try {
        const result = await userModel.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } }, { new: true }).populate("friends");
        if (result) {
            await userModel.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } });
            res.json({
                success: true,
                message: "Friend Added",
                userFriendsList: result.friends
            })
        } else {
            res.json({
                success: false,
                message: "User not found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

const getFriendsList = (req, res) => {
    const { userId } = req.token;
    userModel.findOne({ _id: userId }).populate("friends").then((result) => {
        res.json({
            success: true,
            friends: result.friends
        })
    }).catch((err) => {
        if (err) {
            res.json({
                message: "Server Error",
                error: err.message
            })
        }
    })
}

const changePicture = async (req, res) => {
    const { picture } = req.body;
    const { userId } = req.token;
    try {
        const result = await userModel.findByIdAndUpdate(userId, { picture }, { new: true });
        if (result) {
            res.json({
                success: true,
                message: "Picture Changed",
                newPicture: result.picture
            })
        } else {
            res.json({
                success: false,
                message: "Post Not Found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

module.exports = {
    Register,
    Login,
    getFriendsList,
    addFriend,
    changePicture
}