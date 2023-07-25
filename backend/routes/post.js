const router = require('express').Router();
const Post = require('../models/post.model');

router.route('/').get((req, res) => {
    Post.find()
        .sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const userid = req.body.userid;

    try {
        const newPost = new Post({
            title,
            content,
            image,
            userid,
        });

        const savedPost = await newPost.save();
        res.json('Post Created Successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err + err.code);
    }
});

module.exports = router;