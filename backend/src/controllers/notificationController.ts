import type { Request, Response } from 'express';
import Notification from '../models/Notification.js';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const items = await Notification.find((userId ? { userId } : {}) as any).sort({ date: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

export const addNotification = async (req: Request, res: Response) => {
    try {
        const id = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
        const notification = new Notification({ ...req.body, id });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create notification' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        await Notification.findOneAndUpdate({ id: req.params['id'] } as any, { read: true });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update notification' });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        await Notification.updateMany({ userId, read: false } as any, { read: true });
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update notifications' });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        await Notification.findOneAndDelete({ id: req.params['id'] } as any);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
