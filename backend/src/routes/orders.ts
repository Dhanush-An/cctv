import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus, assignTechnician, saveOrderImages, updateOrderPaymentStatus, refundOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, getOrders);
router.post('/', requireAuth, createOrder);
router.patch('/:id/status', requireAuth, updateOrderStatus);
router.patch('/:id/assign', requireAuth, assignTechnician);
router.patch('/:id/images', requireAuth, saveOrderImages);
router.patch('/:id/payment-status', requireAuth, updateOrderPaymentStatus);
router.post('/:id/refund', requireAuth, refundOrder);

export default router;
