import { Router } from 'express';
import { getOrders, updateOrderStatus, assignTechnician, saveOrderImages } from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/assign', assignTechnician);
router.patch('/:id/images', saveOrderImages);

export default router;
