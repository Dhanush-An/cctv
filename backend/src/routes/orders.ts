import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus, assignTechnician, refundOrder } from '../controllers/ordersController.js';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/technician', assignTechnician);
router.post('/:id/refund', refundOrder);

export default router;
