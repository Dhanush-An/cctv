import { getAuthHeaders } from './apiHelper';
import API_BASE_URL from '../config';

export interface Notification {
    id: string;
    _id?: string;
    userId: string;
    message: string;
    date: string;
    read: boolean;
    type: 'Order' | 'Payment' | 'Review' | 'System';
}

const API_ENDPOINT = `${API_BASE_URL}/api/notifications`;

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

export const addNotification = async (notification: Omit<Notification, 'id' | 'date' | 'read'>): Promise<Notification> => {
    const newNotification = await apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(notification),
    });
    window.dispatchEvent(new Event('notifications-updated'));
    return newNotification;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    try {
        return await apiFetch(`${API_ENDPOINT}?userId=${userId}`);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markAsRead = async (id: string): Promise<void> => {
    await apiFetch(`${API_ENDPOINT}/${id}/read`, { method: 'PATCH' });
    window.dispatchEvent(new Event('notifications-updated'));
};

export const markAllAsRead = async (userId: string): Promise<void> => {
    await apiFetch(`${API_ENDPOINT}/read-all`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });
    window.dispatchEvent(new Event('notifications-updated'));
};

export const deleteNotification = async (id: string): Promise<void> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    window.dispatchEvent(new Event('notifications-updated'));
};
