
// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    offerPrice?: number;
    stock: number;
    image: string;
    description?: string;
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

import API_BASE_URL from '../config';

// ─── Sync Channel (Multi-Tab) ─────────────────────────────────────────────────
export const SYNC_CHANNEL = new BroadcastChannel('cctv_sync');
export const notifySync = (type: 'products' | 'bookings' | 'services') => {
    SYNC_CHANNEL.postMessage({ type: `${type}-updated` });
    window.dispatchEvent(new Event(`${type}-updated`));
};

import { getAuthHeaders } from './apiHelper';

// ─── API Helpers ──────────────────────────────────────────────────────────────
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...(options.headers || {}),
        },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'API Error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const getProducts = async (): Promise<Product[]> => {
    return apiFetch('/api/products');
};

export const saveProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
    });
    notifySync('products');
    return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const updated = await apiFetch(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
    notifySync('products');
    return updated;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    notifySync('products');
};

// ─── Service Offerings API ────────────────────────────────────────────────────
export const getServices = async (): Promise<Service[]> => {
    return apiFetch('/api/services');
};

export const saveService = async (service: Omit<Service, 'id'>): Promise<Service> => {
    const newService = await apiFetch('/api/services', {
        method: 'POST',
        body: JSON.stringify(service),
    });
    notifySync('services');
    return newService;
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service> => {
    const updated = await apiFetch(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
    notifySync('services');
    return updated;
};

export const deleteService = async (id: string): Promise<void> => {
    await apiFetch(`/api/services/${id}`, { method: 'DELETE' });
    notifySync('services');
};

// ─── Service Bookings API ─────────────────────────────────────────────────────
export const getBookings = async (): Promise<ServiceBooking[]> => {
    return apiFetch('/api/services/bookings');
};

export const saveBooking = async (booking: Omit<ServiceBooking, 'id'>): Promise<ServiceBooking> => {
    const newBooking = await apiFetch('/api/services/bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
    });
    notifySync('bookings');
    return newBooking;
};

export const updateBooking = async (id: string, updates: Partial<ServiceBooking>): Promise<ServiceBooking> => {
    const updated = await apiFetch(`/api/services/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
    notifySync('bookings');
    return updated;
};

export const deleteBooking = async (id: string): Promise<void> => {
    await apiFetch(`/api/services/bookings/${id}`, { method: 'DELETE' });
    notifySync('bookings');
};

// ─── Legacy sync stubs (kept so old call sites don't break during migration) ──
export const saveProducts = () => { };
export const saveBookings = () => { };
