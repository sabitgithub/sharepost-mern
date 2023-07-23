const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const sessions = require("express-session");
const Session = require('./models/session.model');

require('dotenv').config();
process.env.TZ = 'Asia/Dhaka';


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*
* Connection MongoDB
* */

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

/*
* Middleware - isAuthenticated
*/

app.use(cookieParser());

const secretKey = crypto.randomBytes(32).toString('hex');

app.use(sessions({
    secret: secretKey,
    saveUninitialized: true,
    cookie: {maxAge: 600000},
    resave: false
}));

const isAuthenticated = async (req, res, next) => {
    try {
        const session = await Session.findOne({sessionId: req.sessionID});
        if (session) {
            const userCheckSession = await Session.findOne({sessionId: req.sessionID});
            if (userCheckSession) {
                const expirationDate = new Date(userCheckSession.expiresAt);
                const currentTime = new Date();

                console.log('current date: ' + currentTime);
                console.log('exp date: ' + expirationDate);
                if (currentTime < expirationDate) {
                    next();
                } else {
                    await Session.deleteOne({sessionId: req.sessionID});
                    res.status(401).json({error: 'Authentication required'});
                }
            }

        } else {
            res.status(401).json({error: 'Authentication required'});
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


app.use('/users', usersRouter); //This is registration user no authentication required
app.use('/auth', userAuth); //This is login user no authentication required


// Routes that require authentication (use the isAuthenticated middleware)
app.use('/profile', isAuthenticated, userProfile);
app.use('/post', isAuthenticated, userPost);
app.use('/like', isAuthenticated, userLike);
app.use('/comment', isAuthenticated, userComment);