import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', requireAuth, getWishlist);
router.post('/', requireAuth, addToWishlist);
router.delete('/', requireAuth, removeFromWishlist);

export default router;
