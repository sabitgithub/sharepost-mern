const express = require('express');
const router = express.Router();
const Login = require('../models/user.model');

// POST /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Login.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Login authenticated successfully, create a session or token
        // and send a success response
        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

module.exports = router;
