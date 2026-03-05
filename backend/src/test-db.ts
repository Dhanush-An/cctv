import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

const testConnection = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ MongoDB Connection Error!');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.reason) console.error('Reason:', error.reason);
        process.exit(1);
    }
};

testConnection();
