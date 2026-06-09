import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
    createPost, 
    getFeed, 
    getExploreFeed, 
    toggleLike,
    deletePost,
    getComments,
    createComment,
    deleteComment
} from '../controllers/post.controller.js';

const router = express.Router();

// Every route here requires the user to be logged in!
router.post('/create', verifyToken, createPost);
router.get('/feed', verifyToken, getFeed);
router.get('/explore', verifyToken, getExploreFeed);

router.delete('/:postId', verifyToken, deletePost);
router.post('/:postId/like', verifyToken, toggleLike);

// Comments
router.get('/:postId/comments', verifyToken, getComments);
router.post('/:postId/comments', verifyToken, createComment);
router.delete('/:postId/comments/:commentId', verifyToken, deleteComment);

export default router;