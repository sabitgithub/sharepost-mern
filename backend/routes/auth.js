const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user.model');
const Session = require('../models/session.model');


router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({error: 'Invalid password'});
        }

        const userCheckSession = await Session.findOne({sessionId: req.sessionID});
        if (userCheckSession) {
            const expirationDate = new Date(userCheckSession.expiresAt);
            const currentTime = new Date();

            console.log('current date: ' + currentTime);
            console.log('exp date: ' + expirationDate);
            if (currentTime < expirationDate) {
                return res.status(200).json({message: 'Already logged in'});
            } else {
                await Session.deleteOne({sessionId: req.sessionID});
            }
        }

        const expireTime = new Date();
        expireTime.setMinutes(expireTime.getMinutes() + 10);

        console.log('inserted exp time: ' + expireTime);

        const newSession = new Session({userId: user._id, sessionId: req.sessionID, expiresAt: expireTime});
        await newSession.save();

        console.log('session from login:' + req.sessionID);
        res.json({
            message: 'Login successful',
            sessionID: req.sessionID,
        });
    } catch (err) {
        res.status(500).json({error: 'An error occurred while processing your request'});
    }
});

router.post('/logout', async (req, res) => {
    console.log(req.sessionID);
    try {
        console.log('session:' + req.sessionID);
        await Session.deleteOne({sessionId: req.sessionID});
        res.json({message: 'Logout successful'});
    } catch (err) {
        res.status(500).json({error: 'Internal server error' + err});
    }
});

module.exports = router;
