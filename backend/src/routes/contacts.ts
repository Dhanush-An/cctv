import { Router } from 'express';
import { getContacts, createContact, updateContactStatus, deleteContact } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', requireAuth, getContacts);
router.post('/', createContact); // Public can submit
router.patch('/:id/status', requireAuth, updateContactStatus);
router.delete('/:id', requireAuth, deleteContact);

export default router;
