import express, { Router } from 'express';
import { getGoogleDetails, createRefreshToken, createAccessToken, refresh, checkUser } from '../controllers/authController.js';
const router = express.Router();
import { authMiddleware, refreshMiddleware } from '../middleware/middleware.js';

router.get('/get-google-details', getGoogleDetails);
router.post('/create-refresh-token', createRefreshToken);
router.post('/create-access-token', createAccessToken);
router.get('/refresh', refreshMiddleware, refresh);
router.get('/me', authMiddleware, checkUser);

export default router;

