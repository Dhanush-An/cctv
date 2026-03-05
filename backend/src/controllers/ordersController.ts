import type { Request, Response } from 'express';
import Order from '../models/Order.js';

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { customerName, customerEmail, items, total, type, paymentStatus } = req.body;

        const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrder = new Order({
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
            paymentStatus: paymentStatus || 'Paid',
            type: type || 'Product'
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { id } as any,
            { status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

export const assignTechnician = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { technician } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { id } as any,
            { technician },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign technician' });
    }
};

export const refundOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedOrder = await Order.findOneAndUpdate(
            { id } as any,
            { status: 'Refunded', paymentStatus: 'Refunded' },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to refund order' });
    }
};
