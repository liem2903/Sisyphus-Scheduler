import express, { Router } from 'express';
import {  getCalender, createEvent, deleteEvent } from '../controllers/calendarController.js';
const router = express.Router();
import { authMiddleware, googleAuthMiddleware } from '../middleware/middleware.js';

router.get('/getCalendar', authMiddleware, googleAuthMiddleware, getCalender);
router.post('/create-event', authMiddleware, googleAuthMiddleware, createEvent);
router.delete('/delete-event/:deletedEvent', authMiddleware, googleAuthMiddleware, deleteEvent);

export default router;
