import express from 'express';
import { getRepos, syncRepos } from '../controllers/github.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Public — anyone can fetch repos for any GitHub username
router.get('/:username/repos', getRepos);

// Protected — re-sync logged-in user's repos using their saved GitHub URL
router.post('/sync', verifyToken, syncRepos);

export default router;
