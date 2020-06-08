const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});


module.exports = User = mongoose.model('User', UserSchema);