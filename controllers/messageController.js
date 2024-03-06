const Messages = require("../models/messageModel");
const Conversations = require("../models/conversationModel");

module.exports.addMessage = async (req, res) => {
	const newMessage = new Messages(req.body);
	try {
			const savedMessage = await newMessage.save();
			const updateConversation = await Conversations.findByIdAndUpdate(
				{ _id: req.body.conversationId }, 
				{ $set: {activityTime: new Date().toISOString()} }
			);
			res.status(200).json(savedMessage);
	} catch (err) {
		console.log('err', err);
		res.status(500).json(err);
	}
}

module.exports.getAllMessage = async (req, res) => {
	const conversationId = req.params.conversationId;
	const userId = req.body._id;
	try {
		const getMessagesByUserId = await Messages.updateMany(
			{ conversationId, 'status.receiverId': userId },
			{ $set: { 'status.$[elem].status': 'delivered' } },
			{ arrayFilters: [{ 'elem.receiverId': userId }] }
		).then(result => {
			if (result.nModified === 0) console.log('No messages updated!');
			console.log('Messages updated successfully!');
		}).catch(error => console.log(error.message));
		const messages = await Messages.find({
			conversationId: req.params.conversationId
		});
		res.status(200).json(messages);
	} catch (err) {
		res.status(500).json(err);
	}
}

