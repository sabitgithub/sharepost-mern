const router = require('express').Router();
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const User = require('../models/user.model');
const LikeModel = require("../models/like.model");

router.route('/').get((req, res) => {
    Comment.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/user-comment').post(async (req, res) => {
    const postid = req.body.postid;
    const sessionUserID = req.body.userid;
    console.log(sessionUserID);
    try {
        const comments = await Comment.find({postid});

        const userComments = [];
        for (const comment of comments) {
            const user = await User.findOne({_id: comment.userid});
            const userComment = {
                _id: comment._id,
                content: comment.content,
                postid: comment.postid,
                userid: comment.userid,
                name: user ? user.name : 'Unknown User',
                createdAt: comment.createdAt,
            };
            userComments.push(userComment);
        }

        return res.status(200).json(userComments);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});


router.route('/add').post(async (req, res) => {
    const content = req.body.content;
    const postid = req.body.postid;
    const userid = req.body.userid;

    if (!content || content.length === 0) {
        return res.status(404).json({error: 'No comments found'});
    }

    try {
        const newComment = new Comment({
            content,
            postid,
            userid,
        });

        const savedComment = await newComment.save();
        res.json('Comment Created Successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err + err.code);
    }
});


// Count total comments & likes for a post using the post ID
router.route('/count').post(async (req, res) => {
    const postid = req.body.postid;

    try {
        const CommentCount = await Comment.countDocuments({postid});
        const LikeCount = await Like.countDocuments({postid});
        res.json({CommentCount: CommentCount, LikeCount: LikeCount});
    } catch (err) {
        res.status(400).json('Error: ' + err + err.code);
    }
});


module.exports = router;