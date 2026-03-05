import type { Request, Response } from 'express';
import Order from '../models/Order.js';

export const getOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await Order.find();
        res.json(orders || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const orderData = req.body;

        // Basic unique ID generation
        const id = `ORD-${Date.now().toString().slice(-6)}`;
        const date = new Date().toISOString();

        const newOrder = new Order({
            ...orderData,
            id,
            date,
            status: orderData.status || 'Pending',
            paymentStatus: orderData.paymentStatus || 'Unpaid'
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Create Order Error:', error);
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

export const saveOrderImages = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { startImage, completionImage } = req.body;

        const update: any = {};
        if (startImage) update.startImage = startImage;
        if (completionImage) update.completionImage = completionImage;

        const updatedOrder = await Order.findOneAndUpdate(
            { id } as any,
            update,
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save order images' });
    }
};

export const updateOrderPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;
        const updatedOrder = await Order.findOneAndUpdate(
            { id } as any,
            { paymentStatus },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update payment status' });
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
