import express, { Router } from 'express';
import { getGoogleDetails, createRefreshToken, createAccessToken, refresh, checkUser, logout, getCalender, createEvent } from '../controllers/authController.js';
const router = express.Router();
import { authMiddleware, refreshMiddleware, googleAuthMiddleware } from '../middleware/middleware.js';

router.get('/get-google-details', getGoogleDetails);
router.post('/create-refresh-token', createRefreshToken);
router.post('/create-access-token', createAccessToken);
router.get('/refresh', refreshMiddleware, refresh);
router.get('/me', authMiddleware, checkUser);
router.get('/refresh/logout', logout);
router.get('/getCalender', authMiddleware, googleAuthMiddleware, getCalender);
router.post('/create-event', authMiddleware, googleAuthMiddleware, createEvent);

export default router;

