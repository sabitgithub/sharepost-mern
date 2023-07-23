const express = require('express');
const router = require('express').Router();
const User = require('../models/user.model');
const Session = require("../models/session.model");

router.get('/', async (req, res) => {

    const userCheckSession = await Session.findOne({sessionId: req.sessionID});
    if (userCheckSession) {
        console.log(userCheckSession);
        User.findById(userCheckSession.userId)
            .then(user => res.json(user))
            .catch(err => res.status(400).json('Error: ' + err));
    }

});

module.exports = router;