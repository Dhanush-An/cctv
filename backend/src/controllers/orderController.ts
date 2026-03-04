import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { Order } from '../models/data.js';

export const getOrders = async (_req: Request, res: Response) => {
    res.json(db.orders || []);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const orders = db.orders || [];
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    const updatedOrder = { ...orders[index], status } as Order;
    db.orders.splice(index, 1, updatedOrder);
    res.json(updatedOrder);
};

export const assignTechnician = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { technician } = req.body;
    const orders = db.orders || [];
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    const updatedOrder = { ...orders[index], technician } as Order;
    db.orders.splice(index, 1, updatedOrder);
    res.json(updatedOrder);
};

export const saveOrderImages = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { startImage, completionImage } = req.body;
    const orders = db.orders || [];
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ message: 'Order not found' });

    const updatedOrder = { ...orders[index] };
    if (startImage) updatedOrder.startImage = startImage;
    if (completionImage) updatedOrder.completionImage = completionImage;

    db.orders.splice(index, 1, updatedOrder as Order);
    res.json(updatedOrder);
};
