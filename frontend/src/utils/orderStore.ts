const STORAGE_KEY = 'cctv_orders';
export const SYNC_CHANNEL = new BroadcastChannel('cctv_sync');

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

const notifySync = () => {
    SYNC_CHANNEL.postMessage({ type: 'orders-updated' });
    window.dispatchEvent(new Event('orders-updated'));
};

export const getOrders = async (): Promise<Order[]> => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error parsing orders:', error);
        return [];
    }
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
        const orders = await getOrders();
        const newOrder: Order = {
            id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
            customerName: orderData.customerName || 'Unknown',
            customerEmail: orderData.customerEmail || '',
            items: orderData.items || [],
            total: orderData.total || 0,
            status: orderData.status || 'Pending',
            date: orderData.date || new Date().toISOString(),
            technician: orderData.technician,
            paymentStatus: orderData.paymentStatus || 'Unpaid',
            type: orderData.type
        };
        orders.push(newOrder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        notifySync();
        return newOrder;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
    try {
        const orders = await getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) return null;

        orders[index].status = status;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        notifySync();
        return orders[index];
    } catch (error) {
        console.error('Error updating status:', error);
        return null;
    }
};

export const updateOrderPaymentStatus = async (id: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> => {
    try {
        const orders = await getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) return null;

        orders[index].paymentStatus = paymentStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        notifySync();
        return orders[index];
    } catch (error) {
        console.error('Error updating payment status:', error);
        return null;
    }
};

export const assignTechnician = async (id: string, technician: string): Promise<Order | null> => {
    try {
        const orders = await getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) return null;

        orders[index].technician = technician;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        notifySync();
        return orders[index];
    } catch (error) {
        console.error('Error assigning technician:', error);
        return null;
    }
};

export const refundOrder = async (id: string): Promise<Order | null> => {
    try {
        const orders = await getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) return null;

        orders[index].status = 'Refunded';
        orders[index].paymentStatus = 'Refunded';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        notifySync();
        return orders[index];
    } catch (error) {
        console.error('Error refunding order:', error);
        return null;
    }
};

export const saveOrderImages = async (orderId: string, startImage?: string, completionImage?: string): Promise<Order | null> => {
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    if (startImage) orders[index].startImage = startImage;
    if (completionImage) orders[index].completionImage = completionImage;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    notifySync();
    return orders[index];
};
