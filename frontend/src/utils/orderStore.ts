import { API_URLS } from '../config';

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
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
    type?: 'Product' | 'Service' | 'Mixed';
    startImage?: string;
    completionImage?: string;
}

const API_BASE = API_URLS.DASHBOARD.replace('dashboard', 'orders');

export const getOrders = async (): Promise<Order[]> => {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
    try {
        const response = await fetch(`${API_BASE}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        const updated = await response.json();
        window.dispatchEvent(new Event('orders-updated'));
        return updated;
    } catch (error) {
        console.error('Error updating status:', error);
        return null;
    }
};

export const assignTechnician = async (id: string, technician: string): Promise<Order | null> => {
    try {
        const response = await fetch(`${API_BASE}/${id}/assign`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ technician })
        });
        if (!response.ok) throw new Error('Failed to assign technician');
        const updated = await response.json();
        window.dispatchEvent(new Event('orders-updated'));
        return updated;
    } catch (error) {
        console.error('Error assigning technician:', error);
        return null;
    }
};

export const saveOrderImages = async (orderId: string, startImage?: string, completionImage?: string): Promise<Order | null> => {
    try {
        const response = await fetch(`${API_BASE}/${orderId}/images`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startImage, completionImage })
        });
        if (!response.ok) throw new Error('Failed to save images');
        const updated = await response.json();
        window.dispatchEvent(new Event('orders-updated'));
        return updated;
    } catch (error) {
        console.error('Error saving images:', error);
        return null;
    }
};

// Compatibility export (not needed for backend but kept if used as mock elsewhere)
export const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    console.warn('createOrder is not yet implemented on backend');
    return null;
};
export const updateOrderPaymentStatus = async (id: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> => {
    console.warn('updateOrderPaymentStatus is not yet implemented on backend', { id, paymentStatus });
    return null;
};
export const refundOrder = async (id: string): Promise<Order | null> => {
    console.warn('refundOrder is not yet implemented on backend', { id });
    return null;
};
