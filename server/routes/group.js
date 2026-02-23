import express from 'express';
import { getGroup, getGroupIds, changeGroupName } from '../controllers/groupController.js';

const router = express.Router();
import { authMiddleware } from '../middleware/middleware.js';

router.get('/get-group', authMiddleware, getGroup);
router.get('/get-group-ids', authMiddleware, getGroupIds);
router.patch('/change-group-name', authMiddleware, changeGroupName);

export default router;

