import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createPost, getFeed, getExploreFeed, toggleLike } from '../controllers/post.controller.js';

const router = express.Router();

// Every route here requires the user to be logged in!
router.post('/create', verifyToken, createPost);
router.get('/feed', verifyToken, getFeed);
router.post('/:postId/like', verifyToken, toggleLike);
router.get('/explore', verifyToken, getExploreFeed);

export default router;