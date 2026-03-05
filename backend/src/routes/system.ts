import { Router } from 'express';
import { getSystemConfig, updateSystemConfig } from '../controllers/systemController.js';

const router = Router();
router.get('/:key', getSystemConfig);
router.post('/', updateSystemConfig);

export default router;
