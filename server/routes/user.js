import express, { Router } from 'express';
import { getFriendCode, getTimeZone } from '../controllers/userController.js';
const router = express.Router();
import { authMiddleware } from '../middleware/middleware.js';

router.get('/get-friend-code', authMiddleware, getFriendCode);
router.get('/get-timezone', authMiddleware, getTimeZone);

export default router;

