import { Router } from 'express';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } from '../controllers/employeeController.js';

const router = Router();

router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.patch('/:id/toggle-status', toggleEmployeeStatus);

export default router;
