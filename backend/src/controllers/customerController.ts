import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { Customer } from '../models/data.js';

// GET /api/customers
export const getCustomers = (req: Request, res: Response) => {
    res.json(db.customers);
};

// POST /api/customers
export const addCustomer = (req: Request, res: Response) => {
    const body = req.body as Omit<Customer, 'id' | 'registeredAt' | 'status'>;
    console.log('[API] Registering customer:', body.email);


    // Safety check for duplicate email
    const exists = db.customers.some(c => c.email.toLowerCase() === body.email.toLowerCase());
    if (exists) {
        res.status(400).json({ error: 'Email already registered' });
        return;
    }

    const newCustomer: Customer = {
        ...body,
        id: `CUS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        registeredAt: new Date().toISOString(),
        status: 'Active',
    };
    db.customers.push(newCustomer);
    res.status(201).json(newCustomer);
};

// DELETE /api/customers/:id
export const deleteCustomer = (req: Request, res: Response) => {
    db.customers = db.customers.filter(c => c.id !== req.params.id);
    res.json({ success: true });
};

export default Router();
