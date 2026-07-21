import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  updateProfile,
  getPublicProfile,
  getSuggestions,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/user.controller.js';

const router = express.Router();

router.put('/profile', verifyToken, updateProfile);

// Suggestions for "Who to Follow" sidebar (must be BEFORE /:username wildcard)
router.get('/suggestions', verifyToken, getSuggestions);

// Search users by skills / name (must be BEFORE /:username wildcard)
router.get('/search', verifyToken, searchUsers);

// Fetch a user's public profile (Protected so only logged-in users can view it)
router.get('/:username', verifyToken, getPublicProfile);

router.post('/:id/follow', verifyToken, followUser);
router.delete('/:id/follow', verifyToken, unfollowUser);
router.get('/:id/followers', verifyToken, getFollowers);
router.get('/:id/following', verifyToken, getFollowing);

export default router;