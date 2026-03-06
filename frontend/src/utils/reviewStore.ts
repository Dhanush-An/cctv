import { getAuthHeaders } from './apiHelper';
import API_BASE_URL from '../config';

export interface Review {
    id: string;
    _id?: string;
    user: string;
    customerEmail: string;
    rating: number;
    comment: string;
    type: 'Product' | 'Service';
    target: string;
    technicianName?: string;
    orderId?: string;
    status: 'Published' | 'Pending' | 'Flagged' | 'Rejected';
    date: string;
}

const API_ENDPOINT = `${API_BASE_URL}/api/reviews`;

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

export const getReviews = async (): Promise<Review[]> => {
    return apiFetch(API_ENDPOINT);
};

export const addReview = async (review: Omit<Review, 'id' | 'status' | 'date'>): Promise<Review> => {
    return apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(review),
    });
};

export const updateReviewStatus = async (id: string, newStatus: Review['status']): Promise<Review[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
    });
    return getReviews();
};

export const deleteReview = async (id: string): Promise<Review[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    return getReviews();
};
