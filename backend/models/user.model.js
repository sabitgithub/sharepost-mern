const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        name: {type: String, trim: true, minlength: 3},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true, minlength: 6},
    },
    {
        timestamps: true,
    });

const User = mongoose.model('User', userSchema);
module.exports = User;