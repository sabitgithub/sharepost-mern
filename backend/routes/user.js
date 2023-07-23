const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

function isStrongPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()\-_=+{}[\]|;:'",.<>?/\\]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
}


router.route('/add').post(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const input_password = req.body.password;

    // Check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(409).json({error: 'Email already registered'});
    }

    if (input_password == 'MyPassw0rd$') {
        return res.status(400).json('Password is same as example');
    }

    if (!isStrongPassword(input_password)) {
        return res.status(400).json('Password does not meet the strength requirements.');
    }

    // Hash the password
    const password = await bcrypt.hash(input_password, 10);

    try {
        const newUser = new User({
            name,
            email,
            password
        });

        // Attempt to save the new user
        const savedUser = await newUser.save();
        res.json('User added successfully');
    } catch (err) {
        if (err.code === 11000) {
            // Check for duplicate key error
            const duplicateEmail = Object.keys(err.keyValue)[0];
            const errorMessage = `The email address '${email}' is already registered. Please use a different email address.`;
            res.status(400).json(errorMessage);
        } else {
            res.status(400).json('Error: ' + err + err.code);
        }
    }
});

module.exports = router;
