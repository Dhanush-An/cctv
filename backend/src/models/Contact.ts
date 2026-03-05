import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Contact', ContactSchema);
