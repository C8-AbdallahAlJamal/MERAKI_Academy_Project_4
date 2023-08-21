const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    Description: {type: String, required: true},
    commenter: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("Comment", commentsSchema);