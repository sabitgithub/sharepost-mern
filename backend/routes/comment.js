const router = require('express').Router();
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');

router.route('/').get((req, res) => {
    Comment.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    const content = req.body.content;
    const postid = req.body.postid;
    const userid = req.body.userid;

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
router.route('/count/:id').get(async (req, res) => {
    const postid = req.params.id;

    try {
        const CommentCount = await Comment.countDocuments({ postid });
        const LikeCount = await Like.countDocuments({ postid });
        res.json({ CommentCount: CommentCount,LikeCount: LikeCount });
    } catch (err) {
        res.status(400).json('Error: ' + err + err.code);
    }
});


module.exports = router;