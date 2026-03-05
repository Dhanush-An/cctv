import type { Request, Response } from 'express';
import Review from '../models/Review.js';

export const getReviews = async (_req: Request, res: Response) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

export const createReview = async (req: Request, res: Response) => {
    try {
        const lastReview = await Review.findOne().sort({ createdAt: -1 });
        const nextId = lastReview && (lastReview as any).id
            ? `REV-${String(parseInt((lastReview as any).id.split('-')[1]) + 1).padStart(3, '0')}`
            : 'REV-001';

        const review = new Review({ ...req.body, id: nextId });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create review' });
    }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
    try {
        const review = await Review.findOneAndUpdate({ id: req.params['id'] } as any, { status: req.body['status'] }, { new: true });
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update review status' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findOneAndDelete({ id: req.params['id'] } as any);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
