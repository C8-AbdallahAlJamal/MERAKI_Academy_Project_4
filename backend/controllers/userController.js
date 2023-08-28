const userModel = require("../models/usersSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
    const { firstName, lastName, email, password, picture, country, location, bio, DOB } = req.body;
    const newUser = new userModel({
        firstName, lastName, email, password, role: "64ebbb0594a4c80b31fd1dc2", picture, country, location, bio, DOB,
    })
    try {
        const result = await (await newUser.save()).populate("role");
        res.status(201).json({
            success: true,
            message: "Account Created",
            user: result
        })
    } catch (error) {
        console.log(error)

        if (error.keyPattern?.email) {
            res.json({
                success: false,
                message: "Account Already Exists",
                error: error.message
            });
        } else {
            res.json({
                success: false,
                message: "Server Error",
                error:error.message
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
                    token: token,
                    userId: result._id
                })
            } else {
                res.json({
                    success: false,
                    message: "The email doesn't exist or the password you entered is wrong"
                })
            }
        } else {
            res.json({
                success: false,
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
        const result = await userModel.findByIdAndUpdate({ _id:userId }, { $addToSet: { friends:  friendId } }, { new: true }).populate("friends");
        if (result) {
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

const getUserInfo = async (req, res) => {
    const { userId } = req.token;
    try {
        const result = await userModel.findById(userId).select("-password -role").populate("friends");
        if (result) {
            res.json({
                success: true,
                userInfo: result
            })
        } else {
            res.json({
                success: false,
                message: "User Not Found"
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

const getAllUsers = async (req, res) => {
    const { userId } = req.token;
    try {
        const result = await userModel.find({ _id: { $ne: userId } });
        if (result) {
            res.json({
                success: true,
                result
            })
        } else {
            res.json({
                success: false,
                message: "Not Found"
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

const removeFriend = async (req, res) => {
    const { userId } = req.token;
    const { friendId } = req.params;
    const result = await userModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true });
    res.json({
        success: true,
        message: "Friend Removed",
        friendsList: result.friends
    })
    console.log(result);
}

module.exports = {
    Register,
    Login,
    getFriendsList,
    addFriend,
    changePicture,
    getUserInfo,
    getAllUsers,
    removeFriend
}