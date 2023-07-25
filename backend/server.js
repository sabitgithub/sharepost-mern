const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const crypto = require("crypto");
const sessions = require("express-session");
const Session = require('./models/session.model');
const cookieParser = require("cookie-parser");
const Cookies = require('js-cookie');

require('dotenv').config();
process.env.TZ = 'Asia/Dhaka';


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
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
    cookie: {maxAge: 600000, sameSite: 'strict'},
    resave: false
}));

const isAuthenticated = async (req, res, next) => {

    console.log(Cookies.get("sessionID"));

    try {
        const sessionID = 'dUzaRJ99XwXqo_qrE5a-9Ow5uo8IxC9U';
        if (!sessionID) {
            return res.status(401).json({error: 'Authentication required[1]. SessionID: ' + sessionID});
        }

        console.log('Get from sessionStorage ' + sessionID);

        const session = await Session.findOne({sessionId: sessionID});
        if (session) {
            const userCheckSession = await Session.findOne({sessionId: sessionID});
            if (userCheckSession) {
                const expirationDate = new Date(userCheckSession.expiresAt);
                const currentTime = new Date();

                console.log('current date: ' + currentTime);
                console.log('exp date: ' + expirationDate);
                if (currentTime < expirationDate) {
                    next();
                } else {
                    await Session.deleteOne({sessionId: sessionID});
                    res.status(401).json({error: 'Authentication required[2]'});
                }
            }

        } else {
            res.status(401).json({error: 'Authentication required[3]'});
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