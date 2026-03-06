import { Router } from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.post('/', requireAuth, addProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
