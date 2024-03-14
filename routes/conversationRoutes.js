const router = require('express').Router();
const { newConversation, getConversation, updateConversation, getFullConversationData } = require('../controllers/conversationController');

// new conversation
router.post('/', newConversation)

// get conversation of user
router.get('/:userId', getFullConversationData)

// update conversation
router.post('/:conversationId', updateConversation)

module.exports = router