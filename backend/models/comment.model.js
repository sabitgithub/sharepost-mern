const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
        content: {type: String},
        userid: {type: String, required: true},
        postid: {type: String, required: true},
    },
    {
        timestamps: true,
    });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;