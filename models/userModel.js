const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    displayName: String,
    firstName: String,
    lastName: String,
    birthday: String,
    phoneNumber: String,
    gender: String,
    address: String,
    backgroundImage: String,
    avatar: {
        type: String,
        default: '/images/default-avatar.png'
    },
    bio: String,
    contacts: Array
}, {
    collection: 'Users',
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)