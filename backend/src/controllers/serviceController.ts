import type { Request, Response } from 'express';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';

// ─── Service Offerings (Admins manage these) ──────────────────────────────────

export const getServiceOfferings = async (req: Request, res: Response) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

export const addServiceOffering = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newService = new Service({
            ...body,
            id: body.id || `SVC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            rating: body.rating ?? 5.0,
        });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add service' });
    }
};

export const updateServiceOffering = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        const updatedService = await Service.findOneAndUpdate({ id } as any, req.body, { new: true });
        if (!updatedService) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' });
    }
};

export const deleteServiceOffering = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        const deleted = await Service.findOneAndDelete({ id } as any);
        if (!deleted) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
};

// ─── Service Bookings (Customers/Staff manage these) ──────────────────────────

// GET /api/services/bookings
export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// POST /api/services/bookings
export const addBooking = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newBooking = new Booking({
            ...body,
            id: body.id || `SRV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            status: body.status ?? 'Confirmed',
        });
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add booking' });
    }
};

// PUT /api/services/bookings/:id
export const updateBooking = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        const updatedBooking = await Booking.findOneAndUpdate({ id } as any, req.body, { new: true });
        if (!updatedBooking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

// DELETE /api/services/bookings/:id
export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        const deleted = await Booking.findOneAndDelete({ id } as any);
        if (!deleted) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};
