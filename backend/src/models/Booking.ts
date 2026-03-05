import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    id: string;
    customerName: string;
    type: 'Installation' | 'Maintenance' | 'Repair';
    date: string;
    time: string;
    status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
    technician?: string;
    address: string;
    priority: 'Low' | 'Medium' | 'High';
}

const BookingSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    type: { type: String, enum: ['Installation', 'Maintenance', 'Repair'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Confirmed', 'In Progress', 'Completed', 'Cancelled'], default: 'Confirmed' },
    technician: { type: String },
    address: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);
