import { Router } from 'express';
import { getReviews, createReview, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';

const router = Router();
router.get('/', getReviews);
router.post('/', createReview);
router.patch('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

export default router;
