import express from 'express'
import { authMiddleware, googleAuthMiddleware } from '../middleware/middleware.js';
import { getFriends, postFriendRequest, declineFriendRequest, acceptFriendRequest, getFriendRequests } from '../controllers/friendController.js';
const router = express.Router()

router.get('/get-friends', authMiddleware, getFriends);
// router.get('/get-mutuals', authMiddleware, getMutuals);
// Get shared availabilities between you and a friend.
// router.get('/get-mutual-availabilities', authMiddleware, googleAuthMiddleware, getMutualAvailabilities);
router.get('/get-friend-requests', authMiddleware, getFriendRequests);
// Post Friend Request --> Pending
router.post('/post-friend-request', authMiddleware, postFriendRequest);
// Decline Friend Request
router.patch('/decline-friend-request', authMiddleware, declineFriendRequest);
// Accept Friend Request
router.patch('/accept-friend-request', authMiddleware, acceptFriendRequest);

export default router;