import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    id: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
    registeredAt: string;
    status: 'Active' | 'Inactive';
    address?: string;
}

const CustomerSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registeredAt: { type: String, default: () => new Date().toISOString() },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    address: { type: String }
}, { timestamps: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
