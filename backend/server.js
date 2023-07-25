const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const crypto = require("crypto");
const sessions = require("express-session");
const Session = require('./models/session.model');
const cookieParser = require("cookie-parser");

require('dotenv').config();
process.env.TZ = 'Asia/Dhaka';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*
* Connection MongoDB
* */

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

/*
* Middleware - isAuthenticated
*/

app.use(cookieParser());

app.use(sessions({
    secret: 'Sabit@123#$', // Replace with a strong secret key
    saveUninitialized: true,
    cookie: {maxAge: 600000, sameSite: 'strict'},
    resave: false
}));

const isAuthenticated = async (req, res, next) => {
    try {
        const sessionID = req.header('sessionID');
        const sessionUserID = req.header('sessionUserID');

        console.log('Get from header sessionID:', sessionID);
        console.log('Get from header sessionUserID:', sessionUserID);

        if (!sessionID) {
            return res.status(401).json({error: 'Authentication required[1]. SessionID: ' + sessionID});
        }

        const userCheckSession = await Session.findOne({sessionId: sessionID});
        console.log('User check: '+sessionID);
        if (userCheckSession) {
            const expirationDate = new Date(userCheckSession.expiresAt);
            const currentTime = new Date();

            if (currentTime < expirationDate) {
                next();
            } else {
                await Session.deleteOne({sessionId: sessionID});
                res.status(401).json({error: 'Authentication required[2]'});
            }
        }
    } catch (err) {
        res.status(500).json({error: 'Internal server error'});
    }
};

/*
* Routing
*/

const usersRouter = require('./routes/user');
const userAuth = require('./routes/auth');
const userPost = require('./routes/post');
const userLike = require('./routes/like');
const userComment = require('./routes/comment');
const userProfile = require('./routes/userProfile');

app.use('/users', usersRouter); // This is registration user no authentication required
app.use('/auth', userAuth); // This is login user no authentication required

// Routes that require authentication (use the isAuthenticated middleware)
app.use('/profile', isAuthenticated, userProfile);
app.use('/post', isAuthenticated, userPost);
app.use('/like', isAuthenticated, userLike);
app.use('/comment', isAuthenticated, userComment);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
