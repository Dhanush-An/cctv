import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus, assignTechnician, saveOrderImages, updateOrderPaymentStatus, refundOrder } from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/assign', assignTechnician);
router.patch('/:id/images', saveOrderImages);
router.patch('/:id/payment-status', updateOrderPaymentStatus);
router.post('/:id/refund', refundOrder);

export default router;
