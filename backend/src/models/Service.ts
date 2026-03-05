import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    id: string;
    name: string;
    type: 'Installation' | 'Maintenance' | 'Repair';
    price: number;
    description: string;
    image: string;
    duration: string;
    rating: number;
}

const ServiceSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Installation', 'Maintenance', 'Repair'], required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, default: 5.0 }
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
