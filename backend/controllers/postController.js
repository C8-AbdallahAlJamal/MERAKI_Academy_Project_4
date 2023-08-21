const postModel = require("../models/postsSchema");

const createNewPost = (req, res) => {
    const {description, picture} = req.body
}

module.exports = {
    createNewPost
}