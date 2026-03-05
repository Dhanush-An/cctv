import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
    id: string; // product/service id
    name: string;
    image: string;
    price: number;
    offerPrice?: number;
    quantity: number;
    category: string;
    userId?: string; // Optional for now
}

const CartItemSchema: Schema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    quantity: { type: Number, default: 1 },
    category: { type: String, required: true },
    userId: { type: String }
}, { timestamps: true });

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);
