const router = require('express').Router();
const { newConversation, getConversation, updateConversation } = require('../controllers/conversationController');

// new conversation
router.post('/', newConversation)

// get conversation of user
router.get('/:userId', getConversation)

// update conversation
router.post('/:conversationId', updateConversation)

module.exports = router