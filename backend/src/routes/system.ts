import { Router } from 'express';
import { getSystemConfig, updateSystemConfig } from '../controllers/systemController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/:key', requireAuth, getSystemConfig);
router.post('/', requireAuth, updateSystemConfig);

export default router;
