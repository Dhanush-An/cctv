import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['Order', 'Payment', 'Review', 'System'], default: 'System' }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
