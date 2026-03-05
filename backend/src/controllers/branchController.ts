import type { Request, Response } from 'express';
import Branch from '../models/Branch.js';

export const getBranches = async (_req: Request, res: Response) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
};

export const createBranch = async (req: Request, res: Response) => {
    try {
        const lastBranch = await Branch.findOne().sort({ createdAt: -1 });
        const nextId = lastBranch && (lastBranch as any).id
            ? `BRN-${String(parseInt((lastBranch as any).id.split('-')[1]) + 1).padStart(3, '0')}`
            : 'BRN-001';

        const branch = new Branch({ ...req.body, id: nextId });
        await branch.save();
        res.status(201).json(branch);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create branch' });
    }
};

export const updateBranch = async (req: Request, res: Response) => {
    try {
        const branch = await Branch.findOneAndUpdate({ id: req.params['id'] } as any, req.body, { new: true });
        if (!branch) return res.status(404).json({ error: 'Branch not found' });
        res.json(branch);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update branch' });
    }
};

export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const branch = await Branch.findOneAndDelete({ id: req.params['id'] } as any);
        if (!branch) return res.status(404).json({ error: 'Branch not found' });
        res.json({ message: 'Branch deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete branch' });
    }
};
