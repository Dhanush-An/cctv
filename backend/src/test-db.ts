import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
console.log('Testing connection to:', uri);

mongoose.connect(uri as string)
    .then(() => {
        console.log('✅ Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:');
        console.error(err.message);
        console.error(err.name);
        if (err.reason) console.error('Reason:', err.reason);
        process.exit(1);
    });
