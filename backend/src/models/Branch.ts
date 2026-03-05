import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    manager: { type: String, required: true },
    serviceAreas: [{ type: String }],
    status: { type: String, enum: ['Operational', 'Limited', 'Closed'], default: 'Operational' },
    staffCount: { type: Number, default: 0 },
    revenue: { type: String, default: '₹0' },
    score: { type: String, default: '0.0' },
    customerBase: { type: String, default: '0' },
    trendUp: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Branch', BranchSchema);
