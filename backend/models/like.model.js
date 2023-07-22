const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
        userid: {type: String, required: true},
        postid: {type: String, required: true},
    },
    {
        timestamps: true,
    });

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;