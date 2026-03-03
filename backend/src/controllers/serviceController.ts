import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { Service, ServiceBooking } from '../models/data.js';

// ─── Service Offerings (Admins manage these) ──────────────────────────────────

export const getServiceOfferings = (req: Request, res: Response) => {
    res.json(db.services);
};

export const addServiceOffering = (req: Request, res: Response) => {
    const body = req.body as Omit<Service, 'id'>;
    const newService: Service = {
        ...body,
        id: `SVC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        rating: body.rating ?? 5.0,
    };
    db.services.push(newService);
    res.status(201).json(newService);
};

export const updateServiceOffering = (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.services.findIndex(s => s.id === id);
    if (idx === -1) { res.status(404).json({ error: 'Service not found' }); return; }
    db.services[idx] = { ...db.services[idx]!, ...req.body, id };
    res.json(db.services[idx]);
};

export const deleteServiceOffering = (req: Request, res: Response) => {
    db.services = db.services.filter(s => s.id !== req.params.id);
    res.json({ success: true });
};

// ─── Service Bookings (Customers/Staff manage these) ──────────────────────────

// GET /api/services/bookings
export const getBookings = (req: Request, res: Response) => {
    res.json(db.bookings);
};

// POST /api/services/bookings
export const addBooking = (req: Request, res: Response) => {
    const body = req.body as Omit<ServiceBooking, 'id'>;
    const newBooking: ServiceBooking = {
        ...body,
        id: `SRV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: body.status ?? 'Confirmed',
    };
    db.bookings.push(newBooking);
    res.status(201).json(newBooking);
};

// PUT /api/services/bookings/:id
export const updateBooking = (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.bookings.findIndex(b => b.id === id);
    if (idx === -1) { res.status(404).json({ error: 'Booking not found' }); return; }
    db.bookings[idx] = { ...db.bookings[idx]!, ...req.body, id };
    res.json(db.bookings[idx]);
};

// DELETE /api/services/bookings/:id
export const deleteBooking = (req: Request, res: Response) => {
    db.bookings = db.bookings.filter(b => b.id !== req.params.id);
    res.json({ success: true });
};

export default Router();
