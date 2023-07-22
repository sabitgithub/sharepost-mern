const router = require('express').Router();
const Like = require('../models/like.model');

router.route('/').get((req, res) => {
    Like.find()
        .then(likes => res.json(likes))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    const userid = req.body.userid;
    const postid = req.body.postid;

    try {
        const newLike = new Like({
            userid,
            postid,
        });

        const savedLike = await newLike.save();
        res.json('New Like Received');
    } catch (err) {
        res.status(400).json('Error: ' + err + err.code);
    }
});

module.exports = router;