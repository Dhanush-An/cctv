import { Router } from 'express';
import { getCustomers, addCustomer, deleteCustomer } from '../controllers/customerController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, getCustomers);
router.post('/', addCustomer); // Registration is usually public
router.delete('/:id', requireAuth, deleteCustomer);

export default router;
