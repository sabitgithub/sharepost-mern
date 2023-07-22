const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
        title: {type: String, trim: true},
        content: {type: String},
        image: {type: String},
        userid: {type: String, required: true},
    },
    {
        timestamps: true,
    });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;