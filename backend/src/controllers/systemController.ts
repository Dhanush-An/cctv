import type { Request, Response } from 'express';
import SystemConfig from '../models/SystemConfig.js';

export const getSystemConfig = async (req: Request, res: Response) => {
    try {
        const config = await SystemConfig.findOne({ key: req.params['key'] } as any);
        res.json(config ? config.value : null);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;
        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        res.json(config.value);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update config' });
    }
};
