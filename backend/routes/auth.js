const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user.model');
const SessionModel = require('../models/session.model');
const session = require("express-session");


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

        const userCheckSession = await SessionModel.findOne({sessionId: req.sessionID});
        if (userCheckSession) {
            const expirationDate = new Date(userCheckSession.expiresAt);
            const currentTime = new Date();

            console.log('current date: ' + currentTime);
            console.log('exp date: ' + expirationDate);
            if (currentTime < expirationDate) {
                return res.status(200).json({message: 'Already logged in'});
            } else {
                await SessionModel.deleteOne({sessionId: req.sessionID});
            }
        }

        const expireTime = new Date();
        expireTime.setMinutes(expireTime.getMinutes() + 10);

        const newSession = new SessionModel({userId: user._id, sessionId: req.sessionID, expiresAt: expireTime});
        await newSession.save();


        console.log('session userid from login:' + session.sessionUserID);
        res.json({
            message: 'Login successful',
            sessionID: req.sessionID,
            sessionUserID: user._id,
        });
    } catch (err) {
        res.status(500).json({error: 'An error occurred while processing your request'});
    }
});

router.post('/logout', async (req, res) => {
    try {
        const sessionID = req.header('sessionID');

        await SessionModel.deleteOne({sessionId: sessionID});
        res.json({message: 'Logout successful'});
    } catch (err) {
        res.status(500).json({error: 'Internal server error' + err});
    }
});

module.exports = router;
