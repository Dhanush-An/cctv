import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = Router();
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/', removeFromWishlist);

export default router;
