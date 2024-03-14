const Conversations = require("../models/conversationModel");
const Users = require('../models/userModel')
const Messages = require("../models/messageModel");

module.exports.newConversation = async (req, res) => {
    const members = req.body.members;
    const createdBy = req.body.createdBy;
    if (members.length > 2) {
        const newConversation = new Conversations({
            members,
            createdBy,
            admins: createdBy,
            activityTime: new Date().toISOString()
        })
        try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        } catch (err) {
            res.status(500).json(err);
        }
    } else if (members.length == 1) {
        const searchConversationBySenderId = await Conversations.find({
            members: { $in:[createdBy] }
        })
        const newConversation = new Conversations({
            members,
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
            members: { $in:[createdBy] }
        })
        const searchConversationByReceiverId = searchConversationBySenderId.find((c) => 
            c.members.length == 2 
            && members.includes(c.members.find((m) => m != createdBy)));
        const newConversation = new Conversations({
            members,
            activityTime: new Date().toISOString()
        });
        try {
            if (searchConversationByReceiverId) {
                res.status(200).json(searchConversationByReceiverId._id);
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

module.exports.getFullConversationData = async (req, res) => {
    const id = req.params.userId;
        if (!id) return res.status(400).json({ error: 'User ID is required' });
        if (id) try {
        const conversations = await Conversations.find({
            members: { $in:[id] }
        });
        const relatedUsersId = [];
        if (!conversations.length) { 
            const resData = {
                relatedUsers: [],
                data: [],
                message: '0 conversation has been get!'
            }
            return res.status(200).json(resData);
        }
        const conversationData = Promise.all(conversations.map(async (c) => {
            const conversationId = c.id;
            const members = c.members;
            members.filter((m) => {
                if (!relatedUsersId.includes(m)) relatedUsersId.push(m);
            })
            const updateMessages = await Messages.updateMany(
                { conversationId, 'status.receiverId': id },
                { $set: { 'status.$[elem].status': 'delivered' } },
                { arrayFilters: [{ 'elem.receiverId': id }] }
            );
            const messages = await Messages.find({ conversationId });
            c.messages = messages;
            return c;
        })).then(async (response) => {
            if (response) {
                if (relatedUsersId.length) {
                    const relatedUsers = await Users.find({ _id: { $in: relatedUsersId } });
                    const resData = {
                        relatedUsers,
                        data: sortConversations(response)
                    }
                    res.status(200).json(resData);
                };
            } else {
                const resData = {
                    relatedUsers: [],
                    data: [],
                    message: '0 conversation has been get!'
                }
                res.status(200).json(resData);
            }
        });
    } catch (err) {
        res.status(500).json(err);
    };
};



const sortConversations = (conversationsData) => {
    if (conversationsData) {
        return conversationsData.sort((a, b) => {
            return (new Date(b.activityTime) - (new Date(a.activityTime)));
        });
    };
};