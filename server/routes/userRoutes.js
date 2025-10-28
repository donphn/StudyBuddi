import express from 'express';
import { login, signup } from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/login
router.post('/login', login);

// POST /api/users/signup
router.post('/signup', signup);

export default router;
