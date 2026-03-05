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

const app = express();
const port = process.env['PORT'] ?? 5000;

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

// ─── Dashboard (static summary) ───────────────────────────────────────────────
app.get('/api/dashboard', (_req: Request, res: Response) => {
    res.json({
        stats: [
            { title: 'Total Sales', value: '$45,320', icon: 'DollarSign', trend: '+15.4%' },
            { title: 'Bookings', value: '320', icon: 'Calendar', trend: '+8.2%' },
            { title: 'Customers', value: '1,250', icon: 'Users', trend: '+12.5%' },
            { title: 'Employees', value: '28', icon: 'HardHat', trend: '0%' },
        ],
        earnings: { monthly: '$12,540', trend: '+15.4%' },
        recentOrders: [
            { id: '#1023', product: 'Canon EOS R5', client: 'John Doe', amount: '$1,200', status: 'Pending' },
            { id: '#1022', product: 'CCTV Installation', client: 'Sarah Lee', amount: '$350', status: 'Completed' },
            { id: '#1021', product: 'Hikvision Camera', client: 'Mark Smith', amount: '$400', status: 'Shipped' },
            { id: '#1020', product: 'Dahua DVR', client: 'Emma Watson', amount: '$280', status: 'Processing' },
        ],
        serviceBookings: [
            { label: 'CCTV Installation', status: 'Scheduled for Today', person: 'Michael Brown' },
            { label: 'Camera Repair', status: 'In Progress', person: 'Lisa Kim' },
            { label: 'Full CCTV Setup', status: 'Completed', person: 'David Johnson' },
            { label: 'Maintenance Visit', status: 'Upcoming', person: 'Kevin Patel' },
        ],
    });
});

app.get('/', (_req: Request, res: Response) => {
    res.send('CCTV Backend API is running ✅');
});

app.listen(port, () => {
    console.log(`✅ Server running on https://cctv-caro.onrender.com`);
});
