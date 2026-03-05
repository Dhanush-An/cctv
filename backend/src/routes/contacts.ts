import { Router } from 'express';
import { getContacts, createContact, updateContactStatus, deleteContact } from '../controllers/contactController.js';

const router = Router();
router.get('/', getContacts);
router.post('/', createContact);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;
