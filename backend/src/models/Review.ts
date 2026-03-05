import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user: { type: String, required: true },
    customerEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    type: { type: String, enum: ['Product', 'Service'], required: true },
    target: { type: String, required: true },
    technicianName: { type: String },
    orderId: { type: String },
    status: { type: String, enum: ['Published', 'Pending', 'Flagged', 'Rejected'], default: 'Pending' },
    date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
