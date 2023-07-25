const router = require('express').Router();
const Post = require('../models/post.model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage});

router.route('/').get((req, res) => {
    Post.find()
        .sort({createdAt: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(upload.single('image'), async (req, res) => {
    const sessionUserID = req.header('sessionUserID');
    const title = req.body.title;
    const content = req.body.content;
    const image = req.file ? req.file.filename : '';
    const userid = sessionUserID;

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