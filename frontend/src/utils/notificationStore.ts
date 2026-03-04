
export interface Notification {
    id: string;
    userId: string;
    message: string;
    date: string;
    read: boolean;
    type: 'Order' | 'Payment' | 'Review' | 'System';
}

const STORAGE_KEY = 'cctv_notifications';

const getStorageNotifications = (): Notification[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const setStorageNotifications = (notifications: Notification[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        // Notify other tabs/components
        window.dispatchEvent(new Event('notifications-updated'));
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'date' | 'read'>): Promise<Notification> => {
    const notifications = getStorageNotifications();
    const newNotification: Notification = {
        ...notification,
        id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        read: false
    };

    setStorageNotifications([newNotification, ...notifications]);
    return newNotification;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const notifications = getStorageNotifications();
    return notifications.filter(n => n.userId.toLowerCase() === userId.toLowerCase());
};

export const markAsRead = async (id: string): Promise<void> => {
    const notifications = getStorageNotifications();
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setStorageNotifications(updated);
};

export const markAllAsRead = async (userId: string): Promise<void> => {
    const notifications = getStorageNotifications();
    const updated = notifications.map(n =>
        n.userId.toLowerCase() === userId.toLowerCase() ? { ...n, read: true } : n
    );
    setStorageNotifications(updated);
};

export const deleteNotification = async (id: string): Promise<void> => {
    const notifications = getStorageNotifications();
    setStorageNotifications(notifications.filter(n => n.id !== id));
};
