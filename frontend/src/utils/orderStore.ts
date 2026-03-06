import { getAuthHeaders } from './apiHelper';
import API_BASE_URL from '../config';

export interface OrderItem {
    id: string;
    _id?: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
}

export interface Order {
    id: string;
    _id?: string;
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

const API_ENDPOINT = `${API_BASE_URL}/api/orders`;

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(endpoint, {
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

export const getOrders = async (): Promise<Order[]> => {
    try {
        return await apiFetch(API_ENDPOINT);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
    try {
        const updated = await apiFetch(`${API_ENDPOINT}/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        window.dispatchEvent(new Event('orders-updated'));
        return updated;
    } catch (error) {
        console.error('Error updating status:', error);
        return null;
    }
};

export const assignTechnician = async (id: string, technician: string): Promise<Order | null> => {
    try {
        const updated = await apiFetch(`${API_ENDPOINT}/${id}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ technician })
        });
        window.dispatchEvent(new Event('orders-updated'));
        return updated;
    } catch (error) {
        console.error('Error assigning technician:', error);
        return null;
    }
};

export const saveOrderImages = async (orderId: string, startImage?: string, completionImage?: string): Promise<Order | null> => {
    try {
        const updated = await apiFetch(`${API_ENDPOINT}/${orderId}/images`, {
            method: 'PATCH',
            body: JSON.stringify({ startImage, completionImage })
        });
        window.dispatchEvent(new Event('orders-updated'));
        return updated;
    } catch (error) {
        console.error('Error saving images:', error);
        return null;
    }
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(orderData)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${response.status}`);
    }
    const result = await response.json();
    window.dispatchEvent(new Event('orders-updated'));
    return result;
};

export const updateOrderPaymentStatus = async (id: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> => {
    try {
        return await apiFetch(`${API_ENDPOINT}/${id}/payment-status`, {
            method: 'PATCH',
            body: JSON.stringify({ paymentStatus })
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return null;
    }
};

export const refundOrder = async (id: string): Promise<Order | null> => {
    try {
        return await apiFetch(`${API_ENDPOINT}/${id}/refund`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error refunding order:', error);
        return null;
    }
};
