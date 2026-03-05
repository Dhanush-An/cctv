import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    id: string;
    customerName: string;
    customerEmail: string;
    items: any[];
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
    date: string;
    technician?: string;
    paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
    type?: 'Product' | 'Service' | 'Mixed';
    startImage?: string;
    completionImage?: string;
}

const OrderSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [Schema.Types.Mixed], required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'], default: 'Pending' },
    date: { type: String, required: true },
    technician: { type: String },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Refunded'], default: 'Unpaid' },
    type: { type: String, enum: ['Product', 'Service', 'Mixed'] },
    startImage: { type: String },
    completionImage: { type: String }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
