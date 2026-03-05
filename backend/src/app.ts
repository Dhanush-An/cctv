import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';
import serviceRoutes from './routes/services.js';
import cartRoutes from './routes/cart.js';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import branchRoutes from './routes/branches.js';
import contactRoutes from './routes/contacts.js';
import reviewRoutes from './routes/reviews.js';
import wishlistRoutes from './routes/wishlist.js';
import notificationRoutes from './routes/notifications.js';
import systemRoutes from './routes/system.js';

import Order from './models/Order.js';
import Customer from './models/Customer.js';
import Employee from './models/Employee.js';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const port = process.env['PORT'] ?? 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/system', systemRoutes);

// ─── Dashboard (dynamic summary) ──────────────────────────────────────────────
app.get('/api/dashboard', async (_req: Request, res: Response) => {
    try {
        const [orders, customersCount, employeesCount] = await Promise.all([
            Order.find(),
            Customer.countDocuments(),
            Employee.countDocuments()
        ]);

        const completedOrders = orders.filter(o => o.status === 'Delivered');
        const totalSales = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Calculate trend (mock for now as we don't have historical snapshots easily without more complex aggregation)
        // But making the values real.

        const currentMonth = new Date().getMonth();
        const earningsThisMonth = completedOrders
            .filter(order => new Date(order.date).getMonth() === currentMonth)
            .reduce((sum, order) => sum + (order.total || 0), 0);

        const recentOrders = orders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map(order => ({
                id: order.id,
                product: order.items.map(i => i.name).join(', ').substring(0, 25) + (order.items.map(i => i.name).join(', ').length > 25 ? '...' : ''),
                client: order.customerName || 'Guest',
                amount: `₹${order.total}`,
                status: order.status
            }));

        const serviceBookings = orders
            .filter(o => o.type === 'Service' || o.type === 'Mixed')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map(booking => ({
                label: booking.items[0]?.name || 'Service',
                status: booking.status === 'Shipped' ? 'In Progress' : booking.status,
                person: booking.technician || 'Unassigned'
            }));

        res.json({
            stats: [
                { title: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, icon: 'DollarSign', trend: '+12%' },
                { title: 'Bookings', value: orders.filter(o => o.type === 'Service' || o.type === 'Mixed').length.toString(), icon: 'Calendar', trend: '+5%' },
                { title: 'Customers', value: customersCount.toString(), icon: 'Users', trend: '+10%' },
                { title: 'Employees', value: employeesCount.toString(), icon: 'HardHat', trend: '0%' },
            ],
            earnings: { monthly: `₹${earningsThisMonth.toLocaleString()}`, trend: '+15.4%' },
            recentOrders,
            serviceBookings,
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

app.get('/', (_req: Request, res: Response) => {
    res.send('CCTV Backend API is running ✅');
});
app.get("/test-db", async (req: Request, res: Response) => {
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    const connectionState = mongoose.connection.readyState;

    res.json({
        message: "Database route working",
        status: "MongoDB connection check",
        connection: states[connectionState] || 'Unknown',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`✅ Server running on https://cctv-caro.onrender.com`);
});
