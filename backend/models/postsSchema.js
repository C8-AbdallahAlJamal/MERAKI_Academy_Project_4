const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    description: {type: mongoose.Schema.Types.Mixed, required: true},
    picture: {type: String},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    numberOfLikes: {type: Number}
})

module.exports = mongoose.model("Post", postsSchema);