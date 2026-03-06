import { Router } from 'express';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../controllers/branchController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', getBranches);
router.post('/', requireAuth, createBranch);
router.put('/:id', requireAuth, updateBranch);
router.delete('/:id', requireAuth, deleteBranch);

export default router;
