import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4 — avoids IPv6 DNS issues
        });
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        console.log('💡 Tip: If you see "querySrv ENOTFOUND", your DNS might be blocking SRV records. Try using Google DNS (8.8.8.8).');
    }
};

