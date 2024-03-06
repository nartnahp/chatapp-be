const router = require('express').Router();
const { addMessage, getAllMessage } = require('../controllers/messageController');

// add
router.post('/', addMessage)

// get
router.post('/:conversationId', getAllMessage)

module.exports = router