import type { Request, Response } from 'express';
import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// POST /api/products
export const addProduct = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newProduct = new Product({
            ...body,
            id: body.id || `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            offers: body.offers ?? [],
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }
        const updatedProduct = await Product.findOneAndUpdate({ id } as any, req.body, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params['id'];
        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }
        const deletedProduct = await Product.findOneAndDelete({ id } as any);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
