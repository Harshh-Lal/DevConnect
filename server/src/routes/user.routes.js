import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getUserProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.put('/profile', verifyToken, updateProfile);

// Fetch a user's public profile (Protected so only logged-in users can view it)
router.get('/:username', verifyToken, getUserProfile);

export default router;  