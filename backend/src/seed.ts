import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Service from './models/Service.js';
import Customer from './models/Customer.js';
import Employee from './models/Employee.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cctv';

const initialProducts = [
    {
        id: 'PRD-1',
        name: 'Hikvision 4MP Turret Camera',
        category: 'Camera',
        price: 3200,
        offerPrice: 2850,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1557597774-9d2739f1599e?auto=format&fit=crop&q=80&w=800&h=600',
        offers: ['Free Installation', '2 Year Warranty']
    },
    {
        id: 'PRD-2',
        name: 'CP PLUS 8CH DVR',
        category: 'DVR',
        price: 4500,
        offerPrice: 3999,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1551817958-c078021964f4?auto=format&fit=crop&q=80&w=800&h=600',
        offers: ['Extra 5% Off']
    }
];

const initialServices = [
    {
        id: 'svc-1',
        name: 'Premium CCTV Installation',
        type: 'Installation',
        price: 7500,
        description: 'Professional setup with 4MP cameras and mobile monitoring.',
        image: 'https://images.unsplash.com/photo-1610056494052-6a4f83a8368c?auto=format&fit=crop&q=80&w=800&h=600',
        duration: '4 Hours',
        rating: 4.8
    }
];

const initialEmployees = [
    {
        id: 'EMP-001',
        name: 'Dhanush Tamilarasan',
        mobile: '6379068722',
        email: 'dhanush.antigraviity@gmail.com',
        address: '36 Harur',
        dateOfJoining: '2026-01-21',
        status: 'Active'
    },
    {
        id: 'EMP-002',
        name: 'Azhaguvel',
        mobile: '7777777777',
        email: 'azhaguvel.antigraviity@gmail.com',
        address: '36 Harur',
        dateOfJoining: '2026-02-09',
        status: 'Active'
    }
];

const initialCustomers = [
    {
        id: 'CUS-001',
        name: 'Demo Customer',
        email: 'customer@demo.com',
        mobile: '9876543210',
        password: 'password123',
        address: 'Chennai, Tamil Nadu',
        registeredAt: '2026-01-01',
        status: 'Active',
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🌱 Connected to MongoDB for seeding...');

        // Clear existing data
        await Product.deleteMany({});
        await Service.deleteMany({});
        await Employee.deleteMany({});
        await Customer.deleteMany({});

        // Insert initial data
        await Product.insertMany(initialProducts);
        await Service.insertMany(initialServices);
        await Employee.insertMany(initialEmployees);
        await Customer.insertMany(initialCustomers);

        console.log('✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed with error:');
        console.dir(error, { depth: null });
        process.exit(1);
    }
};

seedDB();
