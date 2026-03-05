import type { Request, Response } from 'express';
import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const items = await Wishlist.find(userId ? { userId } : {});
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const { productId, userId } = req.body;
        const exists = await Wishlist.findOne({ productId, userId });
        if (exists) return res.json(exists);

        const id = `WISH-${Math.random().toString(36).substr(2, 9)}`;
        const item = new Wishlist({ id, productId, userId });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: 'Failed to add to wishlist' });
    }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const { productId, userId } = req.query;
        await Wishlist.findOneAndDelete({ productId, userId });
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};
