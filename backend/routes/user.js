const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

function isStrongPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()\-_=+{}[\]|;:'",.<>?/\\]/.test(password);

    const hints = [];

    if (password.length < minLength) {
        hints.push("Password should be at least 8 characters long.");
    }

    if (!hasUpperCase || !hasLowerCase) {
        hints.push("Password should contain both uppercase and lowercase characters.");
    }

    if (!hasNumber) {
        hints.push("Password should contain at least one number.");
    }

    if (!hasSpecialChar) {
        hints.push("Password should contain at least one special character (e.g., !@#$%^&*).");
    }

    if (hints.length > 0) {
        return {
            isValid: false,
            hints: hints,
        };
    } else {
        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
        };
    }

}


router.route('/add').post(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const input_password = req.body.password;
    const input_reTypepassword = req.body.reTypepassword;

    if (!name || !email || !input_password || !input_reTypepassword) {
        return res.status(400).json({error: 'All fields are required.'});
    }


    // Check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(409).json({error: 'Email already registered'});
    }

    if (input_password == 'MyPassw0rd$') {
        return res.status(400).json({error: 'Password is same as example'});
    }

    if (!isStrongPassword(input_password).isValid) {
        const passwordHints = isStrongPassword(input_password).hints;
        return res.status(400).json({error: passwordHints});
    }

    if (input_password != input_reTypepassword) {
        return res.status(400).json({error: 'Re Entered Password Not Match'});
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
        res.status(200).json({message: 'User added successfully'});
    } catch (err) {
        if (err.code === 11000) {
            // Check for duplicate key error
            const duplicateEmail = Object.keys(err.keyValue)[0];
            const errorMessage = `The email address '${email}' is already registered. Please use a different email address.`;
            return res.status(400).json({error: errorMessage});
        } else {
            return res.status(400).json({error: 'Error: ' + err + err.code});
        }
    }
});

module.exports = router;
