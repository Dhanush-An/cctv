import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Service from './models/Service.js';
import Customer from './models/Customer.js';
import Employee from './models/Employee.js';
import Branch from './models/Branch.js';
import Contact from './models/Contact.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import Booking from './models/Booking.js';
import CartItem from './models/CartItem.js';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

const seedData = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Product.deleteMany({}),
            Service.deleteMany({}),
            Customer.deleteMany({}),
            Employee.deleteMany({}),
            Branch.deleteMany({}),
            Contact.deleteMany({}),
            Review.deleteMany({}),
            Order.deleteMany({}),
            Booking.deleteMany({}),
            CartItem.deleteMany({})
        ]);

        // Products
        console.log('📦 Seeding Products...');
        await Product.insertMany([
            { id: 'PROD-001', name: '4K Outdoor Bullet Camera', category: 'Cameras', price: 4500, offerPrice: 3800, rating: 4.8, reviews: 125, image: 'https://images.unsplash.com/photo-1557597774-9d2739f05a76?auto=format&fit=crop&q=80', description: 'High-definition 4K outdoor bullet camera with night vision and IP67 weatherproofing.', stock: 50, features: ['4K Resolution', 'Night Vision'] },
            { id: 'PROD-002', name: 'Smart Dome IP Camera', category: 'Cameras', price: 3200, offerPrice: 2800, rating: 4.6, reviews: 89, image: 'https://images.unsplash.com/photo-1582266255745-4e179f4c340f?auto=format&fit=crop&q=80', description: 'Intelligent dome IP camera with motion tracking and two-way audio.', stock: 35, features: ['360° View', 'Face Detection'] }
        ]);

        // Services
        console.log('🛠️ Seeding Services...');
        await Service.insertMany([
            { id: 'SRV-001', title: 'Complete Villa Installation', description: 'Full security setup for villas including 8 cameras, DVR, and mobile access configuration.', price: 15000, duration: '6-8 Hours', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80', active: true },
            { id: 'SRV-002', title: 'Full Maintenance Service', description: 'Comprehensive checkup and cleaning of all cameras, wires, and storage systems.', price: 2500, duration: '2-3 Hours', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80', active: true }
        ]);

        // Employees
        console.log('👷 Seeding Employees...');
        await Employee.insertMany([
            { id: 'EMP-001', name: 'Dhanush', mobile: '2222222222', email: 'dhanush@cctvpro.in', address: 'B1 Sector 5, Chennai', dateOfJoining: '2025-01-15', status: 'Active' },
            { id: 'EMP-002', name: 'Rajesh Kumar', mobile: '6379068722', email: 'rajesh@cctvpro.in', address: 'A1 Sector 2, Chennai', dateOfJoining: '2025-02-10', status: 'Active' }
        ]);

        // Customers
        console.log('👥 Seeding Customers...');
        await Customer.insertMany([
            { id: 'CUST-001', name: 'Test Customer', mobile: '6379068723', email: 'customer@cctvpro.in', registeredAt: new Date().toISOString(), status: 'Active' }
        ]);

        // Branches
        console.log('🏢 Seeding Branches...');
        await Branch.insertMany([
            { id: 'BRN-001', name: 'Downtown HQ', location: '123 Security Plaza, Tech Hub', manager: 'Anand Dev', serviceAreas: ['Downtown', 'Old City'], status: 'Operational', staffCount: 12, revenue: '₹124k', score: '9.8', customerBase: '1.2k', trendUp: true },
            { id: 'BRN-002', name: 'Westside Hub', location: '45 Sunset Blvd, West End', manager: 'Meera Iyer', serviceAreas: ['Westside', 'Beach Rd'], status: 'Operational', staffCount: 8, revenue: '₹45k', score: '8.5', customerBase: '450', trendUp: false }
        ]);

        // Reviews
        console.log('⭐ Seeding Reviews...');
        await Review.insertMany([
            { id: 'REV-001', user: 'Sarah Jenkins', customerEmail: 'sarah@example.com', rating: 5, comment: 'Absolutely fantastic service!', type: 'Service', target: 'CCTV Installation - Villa', status: 'Published', date: '10 Mar 2026' }
        ]);

        console.log('✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
