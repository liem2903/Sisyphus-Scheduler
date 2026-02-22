import express from 'express';
import { getGroup, getGroupIds } from '../controllers/groupController.js';

const router = express.Router();
import { authMiddleware } from '../middleware/middleware.js';

router.get('/get-group', authMiddleware, getGroup);
router.get('/get-group-ids', authMiddleware, getGroupIds);

export default router;

