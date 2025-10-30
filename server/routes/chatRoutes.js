import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';

// Create a new router instance
const router = express.Router();

// Get all messages
router.get('/', getMessages);

// Send a new message
router.post('/', sendMessage);

export default router;
