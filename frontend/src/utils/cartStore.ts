import API_BASE_URL from '../config';

export interface CartItem {
    id: string;
    _id?: string;
    name: string;
    image: string;
    price: number;
    offerPrice?: number;
    quantity: number;
    category: string;
}

const API_ENDPOINT = `${API_BASE_URL}/api/cart`;

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

export const getCart = async (): Promise<CartItem[]> => {
    try {
        return await apiFetch(API_ENDPOINT);
    } catch (e) {
        console.error('Failed to fetch cart:', e);
        return [];
    }
};

export const addToCart = async (item: Omit<CartItem, 'quantity'>): Promise<CartItem> => {
    return apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(item),
    });
};

export const removeFromCart = async (id: string): Promise<CartItem[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    return getCart();
};

export const updateCartQuantity = async (id: string, action: 'inc' | 'dec' | number): Promise<CartItem> => {
    let updateData;
    if (typeof action === 'number') {
        updateData = { quantity: action };
    } else {
        updateData = { action };
    }

    return apiFetch(`${API_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    });
};

export const clearCart = async (): Promise<void> => {
    await apiFetch(API_ENDPOINT, { method: 'DELETE' });
};

export const getCartCount = async (): Promise<number> => {
    const cart = await getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
};
