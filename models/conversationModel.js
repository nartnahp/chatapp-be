const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
    {   
        displayName: {
            type: String,
        },
        members: {
            type: Array,
        },
        messages: {
            type: Array,
        },
        admins: {
            type: Array,
        },
        avatar: {
            type: Array,
        },
        createdBy: {
            type: String,
        },
        lastUpdatedBy: {
            type: String,
        },
        activityTime: {
            type: String,
            default: new Date().toISOString(),
        }
    },
    { timestamps: true}
)
module.exports = mongoose.model('Conversation', conversationSchema)