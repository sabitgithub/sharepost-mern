const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
        sessionId: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now, expires: 60 * 10 }, //600 seconds = 10min
    },
    {
        timestamps: { createdAt: true }, // Automatically add createdAt field
    });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;