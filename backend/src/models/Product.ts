import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    id: string;
    name: string;
    category: string;
    price: number;
    offerPrice?: number;
    stock: number;
    image: string;
    offers: string[];
}

const ProductSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    offers: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
