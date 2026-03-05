import API_BASE_URL from '../config';
import { SYNC_CHANNEL } from './dataStore';

export interface WishlistItem {
    id: string;
    _id?: string;
    productId: string;
    userId: string;
    addedAt: string;
}

const API_ENDPOINT = `${API_BASE_URL}/api/wishlist`;

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'API Error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
    return apiFetch(`${API_ENDPOINT}?userId=${userId}`);
};

export const addToWishlist = async (productId: string, userId: string): Promise<void> => {
    await apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ productId, userId }),
    });
    window.dispatchEvent(new Event('wishlist-updated'));
    SYNC_CHANNEL.postMessage({ type: 'wishlist-updated' });
};

export const removeFromWishlist = async (productId: string, userId: string): Promise<void> => {
    await apiFetch(`${API_ENDPOINT}?productId=${productId}&userId=${userId}`, {
        method: 'DELETE',
    });
    window.dispatchEvent(new Event('wishlist-updated'));
    SYNC_CHANNEL.postMessage({ type: 'wishlist-updated' });
};

export const isInWishlist = async (productId: string, userId: string): Promise<boolean> => {
    const items = await getWishlistItems(userId);
    return items.some(item => item.productId === productId);
};
