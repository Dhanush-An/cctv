import { Router } from 'express';
import { getNotifications, addNotification, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';

const router = Router();
router.get('/', getNotifications);
router.post('/', addNotification);
router.patch('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;
