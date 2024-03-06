const Conversations = require("../models/conversationModel");

module.exports.newConversation = async (req, res) => {
    if (req.body.members.length > 2) {
        const newConversation = new Conversations({
            members: req.body.members,
            createdBy: req.body.createdBy,
            admins: req.body.createdBy,
            activityTime: new Date().toISOString()
        })
        try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        } catch (err) {
            res.status(500).json(err);
        }
    } else if (req.body.members.length == 1) {
        const searchConversationBySenderId = await Conversations.find({
            members: { $in:[req.body.senderId] }
        })
        const newConversation = new Conversations({
            members: req.body.members,
            activityTime: new Date().toISOString()
        });
        try {
            if (searchConversationBySenderId.find((c) => c.members.length == 1)) {
                res.status(500).json({ mess: 'Conversation is already created.'})
            } else {
                const savedConversation = await newConversation.save();
                res.status(200).json(savedConversation);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        const searchConversationBySenderId = await Conversations.find({
            members: { $in:[req.body.senderId] }
        })
        const searchConversationByReceiverId = searchConversationBySenderId.find((c) => 
            !c.chanelName 
            && !c.members.includes(req.body.senderId)
            && c.members.length == 2 
            && c.members.includes(req.body.receiverId) 
        )
        const newConversation = new Conversations({
            members: req.body.members,
            activityTime: new Date().toISOString()
        });
        try {
            if (searchConversationByReceiverId) {
                res.status(500).json({ mess: 'Conversation is already created.'})
            } else {
                const savedConversation = await newConversation.save();
                res.status(200).json(savedConversation);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversations.find({
            members: { $in:[req.params.userId] }
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.updateConversation = async (req, res) => {
    const { id, members, admins, chanelName, updater } = req.body
    try {
        const getConversationToUpdated = await Conversations.find({ id })
        if (!getConversationToUpdated) {
            res.status(403)
            return res.json({ mess: 'Conversation not exist' })
        } else {
            if (updater && getConversationToUpdated.find((c) => c.admins.find((admin) => admin === updater))) {
                const updatedConversation = await Conversations.updateOne({ id }, {$set: {
                    members: [...members],
                    admins: [...admins],
                    chanelName: chanelName,
                    lastUpdatedBy: updater,
                    activityTime: new Date().toISOString()
                }})
                if (!updatedConversation) {
                    res.status(500)
                    return res.json({ mess: 'Conversation update failed' })
                }
                const conversation = await Conversations.find({ id })
                console.log('updatedConversation', updatedConversation)
                res.status(200).json(conversation)
            } else {
                res.status(500).json(err);
                return res.json({ mess: 'You have not permission to updated this conversation' })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
}