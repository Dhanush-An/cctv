import type { Request, Response } from 'express';
import CartItem from '../models/CartItem.js';

// GET /api/cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const cart = await CartItem.find();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// POST /api/cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const item = req.body;
        const existing = await CartItem.findOne({ id: item.id });
        if (existing) {
            existing.quantity += 1;
            await existing.save();
            res.json(existing);
        } else {
            const newItem = new CartItem({ ...item, quantity: 1 });
            await newItem.save();
            res.status(201).json(newItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// DELETE /api/cart/:id
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await CartItem.findOneAndDelete({ id } as any);
        const cart = await CartItem.find();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
};

// DELETE /api/cart
export const clearCart = async (req: Request, res: Response) => {
    try {
        await CartItem.deleteMany({});
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};

// PUT /api/cart/:id
export const updateCartQuantity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity, action } = req.body;
        const item = await CartItem.findOne({ id: id } as any);

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (action === 'inc') {
            item.quantity += 1;
        } else if (action === 'dec') {
            item.quantity = Math.max(1, item.quantity - 1);
        } else if (typeof quantity === 'number') {
            item.quantity = Math.max(1, quantity);
        }

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart quantity' });
    }
};
