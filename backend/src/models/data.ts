// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    offerPrice?: number;
    stock: number;
    image: string;
    offers: string[];
}

export interface Service {
    id: string;
    name: string;
    type: 'Installation' | 'Maintenance' | 'Repair';
    price: number;
    description: string;
    image: string;
    duration: string;
    rating: number;
}

export interface ServiceBooking {
    id: string;
    customerName: string;
    type: 'Installation' | 'Maintenance' | 'Repair';
    date: string;
    time: string;
    status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
    technician?: string;
    address: string;
    priority: 'Low' | 'Medium' | 'High';
}

export interface OrderItem {
    id: string; // product/service id
    name: string;
    quantity: number;
    price: number;
    category?: string; // Product or Service category
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
    date: string;
    technician?: string;
    paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
    type?: 'Product' | 'Service' | 'Mixed'; // To categorize in Admin
}

export interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    offerPrice?: number;
    quantity: number;
    category: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
    registeredAt: string;
    status: 'Active' | 'Inactive';
    address?: string;
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const loadDB = (): typeof initialDB => {
    if (fs.existsSync(DB_PATH)) {
        try {
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
            return { ...initialDB, ...data };
        } catch (e) {
            console.error('Failed to parse db.json, using empty state');
        }
    }
    return initialDB;
};

const saveDB = (data: any) => {
    try {
        console.log('[DB] Saving to disk...');
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('[DB] Failed to save:', err);
    }
};

const initialDB = {
    products: [] as Product[],
    services: [
        {
            id: 'svc-1',
            name: 'Premium CCTV Installation',
            type: 'Installation',
            price: 7500,
            description: 'Professional setup with 4MP cameras and mobile monitoring.',
            image: 'https://images.unsplash.com/photo-1557597774-9d2739f1599e?auto=format&fit=crop&q=80&w=800&h=600',
            duration: '4 Hours',
            rating: 4.8
        }
    ],
    bookings: [] as ServiceBooking[],
    cart: [] as CartItem[],
    orders: [] as Order[],
    customers: [
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
    ] as Customer[],
};

// ─── In-Memory Store with Persistence ──────────────────────────────────────────
export const db = new Proxy(loadDB(), {
    set(target, prop, value) {
        (target as any)[prop] = value;
        saveDB(target);
        return true;
    },
    get(target, prop) {
        const val = (target as any)[prop];
        if (typeof val === 'object' && val !== null) {
            // If it's an array, proxy it too so mutations trigger save
            if (Array.isArray(val)) {
                return new Proxy(val, {
                    get(t, p) {
                        const item = (t as any)[p];
                        if (typeof item === 'function' && ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(p as string)) {
                            return (...args: any[]) => {
                                const res = item.apply(t, args);
                                saveDB(target);
                                return res;
                            };
                        }
                        return item;
                    }
                });
            }
            return val;
        }
        return val;
    }
});
