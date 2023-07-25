const router = require('express').Router();
const Like = require('../models/like.model');
const session = require("express-session");
const SessionModel = require("../models/session.model");
const LikeModel = require("../models/like.model");


router.route('/').get((req, res) => {
    Like.find()
        .then(likes => res.json(likes))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
        const sessionUserID = req.header('sessionUserID');

        const userid = sessionUserID;
        const postid = req.body.postid;

        if (!userid) {
            return res.status(404).json({error: 'User not found'});
        }
        if (!postid) {
            return res.status(404).json({error: 'Post not found'});
        }

        try {
            const userLike = await LikeModel.findOne({userid: userid, postid: postid});
            if (userLike) {

                console.log('Found Like: ' + userLike._id);
                await LikeModel.deleteOne({_id: userLike._id});
                return res.status(200).json({message: 'UnLiked'});
            }
        } catch
            (err) {
            console.log(err);
        }

        try {
            const newLike = new Like({
                userid,
                postid,
            });

            const savedLike = await newLike.save();
            return res.status(200).json({message: 'Liked'});
        } catch (err) {
            res.status(400).json('Error: ' + err + err.code);
        }
    }
);

router.route('/user-like').post(async (req, res) => {
    const sessionUserID = req.header('sessionUserID');
    const userid = sessionUserID;
    const postid = req.body.postid;

    if (!userid) {
        return res.status(404).json({error: 'User not found'});
    }
    if (!postid) {
        return res.status(404).json({error: 'Post not found'});
    }

    try {
        const userLike = await Like.findOne({userid: userid, postid: postid});
        if (userLike) {
            return res.status(200).json({message: 'Liked'});
        } else {
            return res.status(200).json({message: 'NotLiked'});
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
