
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

// Initialize with sample notifications if empty
if (!localStorage.getItem(STORAGE_KEY)) {
    const samples: Notification[] = [
        {
            id: 'NTF-1111',
            userId: 'admin',
            message: 'New technician registration pending approval.',
            type: 'System',
            date: new Date().toISOString(),
            read: false
        },
        {
            id: 'NTF-2222',
            userId: '6379068722', // Rajesh Kumar
            message: 'You have a new job assigned: Security System Maintenance.',
            type: 'Order',
            date: new Date().toISOString(),
            read: false
        },
        {
            id: 'NTF-3333',
            userId: 'admin',
            message: 'Monthly revenue report is ready for review.',
            type: 'System',
            date: new Date().toISOString(),
            read: true
        }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
}

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
