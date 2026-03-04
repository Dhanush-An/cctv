import { Router } from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken);

export default router;
