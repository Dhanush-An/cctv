import { Router } from 'express';
import { getNotifications, addNotification, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', requireAuth, getNotifications);
router.post('/', requireAuth, addNotification);
router.patch('/:id/read', requireAuth, markAsRead);
router.post('/read-all', requireAuth, markAllAsRead);
router.delete('/:id', requireAuth, deleteNotification);

export default router;
