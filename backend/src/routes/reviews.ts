import { Router } from 'express';
import { getReviews, createReview, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', getReviews); // Public can see reviews
router.post('/', requireAuth, createReview);
router.patch('/:id/status', requireAuth, updateReviewStatus);
router.delete('/:id', requireAuth, deleteReview);

export default router;
