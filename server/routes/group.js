import express from 'express';
import { getGroup, getGroupIds, changeGroupName, deleteGroup} from '../controllers/groupController.js';

const router = express.Router();
import { authMiddleware } from '../middleware/middleware.js';

router.get('/get-group', authMiddleware, getGroup);
router.get('/get-group-ids', authMiddleware, getGroupIds);
router.patch('/change-group-name', authMiddleware, changeGroupName);
router.delete('/delete-group/:deleteGroupId', authMiddleware, deleteGroup);

export default router;

