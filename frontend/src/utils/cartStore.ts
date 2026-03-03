const STORAGE_KEY = 'cctv_cart';

export interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    offerPrice?: number;
    quantity: number;
    category: string;
}

// GET cart
export const getCart = async (): Promise<CartItem[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Invalid cart data in localStorage:', e);
        return [];
    }
};

// POST add or increment
export const addToCart = async (item: Omit<CartItem, 'quantity'>): Promise<CartItem> => {
    const cart = await getCart();
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
        existing.quantity += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        return existing;
    } else {
        const newItem = { ...item, quantity: 1 };
        cart.push(newItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        return newItem;
    }
};

// DELETE item
export const removeFromCart = async (id: string): Promise<CartItem[]> => {
    const cart = await getCart();
    const filtered = cart.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
};

// PUT update quantity
export const updateCartQuantity = async (id: string, action: 'inc' | 'dec' | number): Promise<CartItem> => {
    const cart = await getCart();
    const item = cart.find(c => c.id === id);
    if (!item) throw new Error('Item not found');

    if (action === 'inc') {
        item.quantity += 1;
    } else if (action === 'dec') {
        item.quantity = Math.max(1, item.quantity - 1);
    } else {
        item.quantity = Math.max(1, action as number);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return item;
};

// DELETE all
export const clearCart = async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
};

// Total count helper
export const getCartCount = async (): Promise<number> => {
    const cart = await getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
};
