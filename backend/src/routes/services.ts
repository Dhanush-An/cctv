import { Router } from 'express';
import {
    getServiceOfferings, addServiceOffering, updateServiceOffering, deleteServiceOffering,
    getBookings, addBooking, updateBooking, deleteBooking
} from '../controllers/serviceController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Service Offerings
router.get('/', getServiceOfferings);
router.post('/', requireAuth, addServiceOffering);
router.put('/:id', requireAuth, updateServiceOffering);
router.delete('/:id', requireAuth, deleteServiceOffering);

// Service Bookings
router.get('/bookings', requireAuth, getBookings);
router.post('/bookings', requireAuth, addBooking);
router.put('/bookings/:id', requireAuth, updateBooking);
router.delete('/bookings/:id', requireAuth, deleteBooking);

export default router;
