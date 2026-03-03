import { Router } from 'express';
import {
    getServiceOfferings, addServiceOffering, updateServiceOffering, deleteServiceOffering,
    getBookings, addBooking, updateBooking, deleteBooking
} from '../controllers/serviceController.js';

const router = Router();

// Service Offerings
router.get('/', getServiceOfferings);
router.post('/', addServiceOffering);
router.put('/:id', updateServiceOffering);
router.delete('/:id', deleteServiceOffering);

// Service Bookings
router.get('/bookings', getBookings);
router.post('/bookings', addBooking);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

export default router;
