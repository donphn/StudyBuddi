import express from 'express';
import {
  getCounter1,
  incrementCounter1,
  resetCounter1,
  getCounter2,
  incrementCounter2,
  resetCounter2
} from '../controllers/counterController.js';

const router = express.Router();

// ========== COUNTER 1 ROUTES ==========
// GET /api/counter/1 - Get counter 1 value
router.get('/1', getCounter1);

// POST /api/counter/1/increment - Increment counter 1
router.post('/1/increment', incrementCounter1);

// POST /api/counter/1/reset - Reset counter 1 to 0
router.post('/1/reset', resetCounter1);

// ========== COUNTER 2 ROUTES ==========
// GET /api/counter/2 - Get counter 2 value
router.get('/2', getCounter2);

// POST /api/counter/2/increment - Increment counter 2
router.post('/2/increment', incrementCounter2);

// POST /api/counter/2/reset - Reset counter 2 to 0
router.post('/2/reset', resetCounter2);

export default router;
