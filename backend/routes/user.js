const router = require('express').Router();
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


router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (password == 'MyPassw0rd$') {
        return res.status(400).json('Password is same as example');
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json('Password does not meet the strength requirements.');
    }

    try {
        const newUser = new User({
            name,
            email,
            password,
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
