import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { CartItem } from '../models/data.js';

// GET /api/cart
export const getCart = (req: Request, res: Response) => {
    res.json(db.cart);
};

// POST /api/cart
export const addToCart = (req: Request, res: Response) => {
    const item = req.body as Omit<CartItem, 'quantity'>;
    const existing = db.cart.find(c => c.id === item.id);
    if (existing) {
        existing.quantity += 1;
        res.json(existing);
    } else {
        const newItem: CartItem = { ...item, quantity: 1 };
        db.cart.push(newItem);
        res.status(201).json(newItem);
    }
};

// DELETE /api/cart/:id
export const removeFromCart = (req: Request, res: Response) => {
    db.cart = db.cart.filter(c => c.id !== req.params.id);
    res.json(db.cart);
};

// DELETE /api/cart
export const clearCart = (req: Request, res: Response) => {
    db.cart = [];
    res.json({ success: true });
};

// PUT /api/cart/:id
export const updateCartQuantity = (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity, action } = req.body; // action: 'inc', 'dec', or undefined for direct set
    const item = db.cart.find(c => c.id === id);

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

    res.json(item);
};

export default Router();
