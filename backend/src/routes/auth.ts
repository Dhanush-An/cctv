import { Router } from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.get('/verify', requireAuth, verifyToken);

export default router;
