import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    dateOfJoining: string;
    status: 'Active' | 'Inactive';
}

const EmployeeSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    dateOfJoining: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
