import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://dhanushantigraviity_db_user:Dhanush123@cluster0.j4aoj4o.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
    .then(() => {
        console.log("✅ CONNECTED");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ ERROR:", err.message);
        process.exit(1);
    });
