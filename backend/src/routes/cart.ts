import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart, updateCartQuantity } from '../controllers/cartController.js';

const router = Router();

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', removeFromCart);
router.put('/:id', updateCartQuantity);
router.delete('/', clearCart);

export default router;
