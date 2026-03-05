import type { Request, Response } from 'express';
import Customer from '../models/Customer.js';

// GET /api/customers
export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

// POST /api/customers
export const addCustomer = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        console.log('[API] Registering customer:', body.email);

        // Safety check for duplicate email
        const exists = await Customer.findOne({ email: body.email.toLowerCase() });
        if (exists) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        const newCustomer = new Customer({
            ...body,
            id: body.id || `CUS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            registeredAt: new Date().toISOString(),
            status: 'Active',
        });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add customer' });
    }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        const deleted = await Customer.findOneAndDelete({ id } as any);
        if (!deleted) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};
