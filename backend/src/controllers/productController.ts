import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../models/data.js';
import type { Product } from '../models/data.js';

// GET /api/products
export const getProducts = (req: Request, res: Response) => {
    res.json(db.products);
};

// POST /api/products
export const addProduct = (req: Request, res: Response) => {
    const body = req.body as Omit<Product, 'id'>;
    const newProduct: Product = {
        ...body,
        id: `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        offers: body.offers ?? [],
    };
    db.products.push(newProduct);
    res.status(201).json(newProduct);
};

// PUT /api/products/:id
export const updateProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) { res.status(404).json({ error: 'Product not found' }); return; }
    db.products[idx] = { ...db.products[idx]!, ...req.body, id };
    res.json(db.products[idx]);
};

// DELETE /api/products/:id
export const deleteProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    const before = db.products.length;
    db.products = db.products.filter(p => p.id !== id);
    if (db.products.length === before) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json({ success: true });
};

// dummy export to satisfy router import pattern
export default Router();
