import express, { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, getMe);

export default router;