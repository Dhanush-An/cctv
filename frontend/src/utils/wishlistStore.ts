
import { SYNC_CHANNEL } from './dataStore';

export interface WishlistItem {
    id: string;
    productId: string;
    userId: string;
    addedAt: string;
}

const WISHLIST_KEY = 'cctv_wishlist';

const getWishlist = (): WishlistItem[] => {
    try {
        const data = localStorage.getItem(WISHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveWishlist = (items: WishlistItem[]) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wishlist-updated'));
    SYNC_CHANNEL.postMessage({ type: 'wishlist-updated' });
};

export const getWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
    const items = getWishlist();
    return items.filter(item => item.userId === userId);
};

export const addToWishlist = async (productId: string, userId: string): Promise<void> => {
    const items = getWishlist();
    if (items.some(item => item.productId === productId && item.userId === userId)) {
        return;
    }
    const newItem: WishlistItem = {
        id: `WISH-${Math.random().toString(36).substr(2, 9)}`,
        productId,
        userId,
        addedAt: new Date().toISOString()
    };
    saveWishlist([...items, newItem]);
};

export const removeFromWishlist = async (productId: string, userId: string): Promise<void> => {
    const items = getWishlist();
    saveWishlist(items.filter(item => !(item.productId === productId && item.userId === userId)));
};

export const isInWishlist = async (productId: string, userId: string): Promise<boolean> => {
    const items = getWishlist();
    return items.some(item => item.productId === productId && item.userId === userId);
};
