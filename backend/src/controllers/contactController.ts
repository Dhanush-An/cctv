import type { Request, Response } from 'express';
import Contact from '../models/Contact.js';

export const getContacts = async (_req: Request, res: Response) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

export const createContact = async (req: Request, res: Response) => {
    try {
        const lastContact = await Contact.findOne().sort({ createdAt: -1 });
        const nextId = lastContact && (lastContact as any).id
            ? `MSG-${String(parseInt((lastContact as any).id.split('-')[1]) + 1).padStart(3, '0')}`
            : 'MSG-001';

        const contact = new Contact({ ...req.body, id: nextId });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create contact message' });
    }
};

export const updateContactStatus = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.findOneAndUpdate({ id: req.params['id'] } as any, { status: req.body['status'] }, { new: true });
        if (!contact) return res.status(404).json({ error: 'Message not found' });
        res.json(contact);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update message status' });
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.findOneAndDelete({ id: req.params['id'] } as any);
        if (!contact) return res.status(404).json({ error: 'Message not found' });
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
