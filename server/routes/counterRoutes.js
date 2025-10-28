import express from 'express';
import {
  getCounter,
  incrementCounter,
  resetCounter
} from '../controllers/counterController.js';

const router = express.Router();

// GET /api/counter - Get current counter value
router.get('/', getCounter);

// POST /api/counter/increment - Increment counter
router.post('/increment', incrementCounter);

// POST /api/counter/reset - Reset counter to 0
router.post('/reset', resetCounter);

export default router;
