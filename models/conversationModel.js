const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
    {   
        chanelName: {
            type: String,
        },
        members: {
            type: Array,
        },
        admins: {
            type: Array,
        },
        createdBy: {
            type: String,
        },
        lastUpdatedBy: {
            type: String,
        },
        activityTime: {
            type: String
        }
    },
    { timestamps: true}
)
module.exports = mongoose.model('Conversation', conversationSchema)