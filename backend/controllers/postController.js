const postModel = require("../models/postsSchema");
const commentModel = require("../models/commentsSchema");
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

const updatePostById = async (req, res) => {
    const { postId } = req.params;
    const { description, picture } = req.body;
    try {
        const post = await postModel.findByIdAndUpdate(postId, req.body, { new: true });
        if (post) {
            res.json({
                success: true,
                message: "Post Updated",
                post
            })
        } else {
            res.json({
                success: false,
                message: "Post Not Fount"
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

const Like = async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await postModel.findByIdAndUpdate(postId, { $inc: { numberOfLikes: 1 } }, { new: true });
        if (result) {
            res.json({
                success: true,
                message: "Like added",
                post: result
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

const Unlike = async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await postModel.findByIdAndUpdate(postId, { $inc: { numberOfLikes: -1 } }, { new: true });
        if (result) {
            if (result.numberOfLikes < 0) {
                result.numberOfLikes = 0;
                result.save();
            }
            res.json({
                success: true,
                message: "Like removed",
                post: result
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

const addComment = async (req, res) => {
    const { postId } = req.params;
    const commenter = req.token.userId;
    const { description } = req.body;
    try {
        const newComment = new commentModel({
            description,
            commenter
        });
        await newComment.save();
        const result = await postModel.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment._id } }, { new: true }).populate("comments");
        res.json({
            success: true,
            message: "Comment Added",
            post: result
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }

}

const removeComment = async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        const post = await postModel.findByIdAndUpdate({ _id: postId }, { $pull: { comments: commentId } }, { new: true }).populate("comments");
        await commentModel.findOneAndDelete({ _id: commentId });
        res.json({
            success: true,
            message: "Comment removed",
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

const getAllPosts = async (req, res) => {
    try {
        const result = await postModel.find({});
        res.json({
            success: true,
            posts: result.length ? result : "No Posts Available"
        })
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }
}

const getMyPosts = async (req, res) => {
    const { userId } = req.token;
    try {
        const result = await postModel.find({ author: userId });
        res.json({
            success: true,
            posts: result.length ? result : "No Posts Available"
        })
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }
}



const getPostByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await postModel.find({ author: userId });
        if (result.length) {
            res.json({
                success: true,
                message: "All Posts",
                posts: result
            })
        } else {
            res.json({
                success: false,
                message: "No Posts Found"
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
    removePostById,
    updatePostById,
    Like,
    Unlike,
    addComment,
    removeComment,
    getAllPosts,
    getMyPosts,
    getPostByUserId
}