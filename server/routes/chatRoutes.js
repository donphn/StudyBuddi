import express from 'express';
import { getMessages, sendMessage, deleteMessage } from '../controllers/chatController.js';

const router = express.Router();

// Get all messages
router.get('/', getMessages);

// Send a new message
router.post('/', sendMessage);

// Delete a message
router.delete('/:messageId', deleteMessage);

export default router;
