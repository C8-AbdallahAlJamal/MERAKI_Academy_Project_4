const postModel = require("../models/postsSchema");

const createNewPost = async (req, res) => {
    const { description, picture } = req.body;
    const author = req.token.userId;
    const newPost = new postModel({
        author,
        description,
        picture,
        comments: [],
        numberOfLikes: 0
    })
    try {
        const post = await newPost.save();
        res.json({
            success: true,
            message: "Post Created",
            post
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

const removePostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await postModel.findOneAndDelete({ _id: postId });
        if (post) {
            res.json({
                success: true,
                message: "Post Deleted",
                post
            })
        } else {
            res.json({
                success: true,
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
    createNewPost,
    removePostById
}