import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Wishlist', WishlistSchema);
