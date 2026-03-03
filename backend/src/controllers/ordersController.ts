import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { Order, OrderItem } from '../models/data.js';

export const getOrders = (req: Request, res: Response) => {
    res.json(db.orders);
};

export const createOrder = (req: Request, res: Response) => {
    const { customerName, customerEmail, items, total, type } = req.body;

    // Generate a simple ID
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
        id: newId,
        customerName: customerName || 'Anonymous',
        customerEmail: customerEmail || 'unknown@example.com',
        items: items || [],
        total: total || 0,
        status: 'Pending',
        date: new Date().toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        }),
        paymentStatus: 'Paid',
        type: type || 'Product'
    };

    db.orders.push(newOrder);
    res.status(201).json(newOrder);
};

export const updateOrderStatus = (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = db.orders.find(o => o.id === id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    res.json(order);
};

export const assignTechnician = (req: Request, res: Response) => {
    const { id } = req.params;
    const { technician } = req.body;

    const order = db.orders.find(o => o.id === id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    order.technician = technician;
    res.json(order);
};

export const refundOrder = (req: Request, res: Response) => {
    const { id } = req.params;

    const order = db.orders.find(o => o.id === id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Refunded';
    order.paymentStatus = 'Refunded';
    res.json(order);
};
