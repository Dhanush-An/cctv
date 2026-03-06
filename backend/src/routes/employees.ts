import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } from '../controllers/employeeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, getEmployees);
router.post('/', requireAuth, createEmployee);
router.put('/:id', requireAuth, updateEmployee);
router.delete('/:id', requireAuth, deleteEmployee);
router.patch('/:id/toggle-status', requireAuth, toggleEmployeeStatus);

export default router;
