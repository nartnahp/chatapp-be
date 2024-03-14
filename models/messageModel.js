const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: String
		},
		sender: {
			type: String
		},
		text: {
			type: String
		},
		status: {
			type: Array
		},
		receivers: {
			type: Array
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Messages', messageSchema)