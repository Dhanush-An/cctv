
// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    offerPrice?: number;
    stock: number;
    image: string;
    description?: string;
    offers: string[];
}

export interface Service {
    id: string;
    name: string;
    type: 'Installation' | 'Maintenance' | 'Repair';
    price: number;
    description: string;
    image: string;
    duration: string;
    rating: number;
}

export interface ServiceBooking {
    id: string;
    customerName: string;
    type: 'Installation' | 'Maintenance' | 'Repair';
    date: string;
    time: string;
    status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
    technician?: string;
    address: string;
    priority: 'Low' | 'Medium' | 'High';
}

// ─── Sync Channel (Multi-Tab) ─────────────────────────────────────────────────
export const SYNC_CHANNEL = new BroadcastChannel('cctv_sync');
export const notifySync = (type: 'products' | 'bookings' | 'services') => {
    SYNC_CHANNEL.postMessage({ type: `${type}-updated` });
    // Also dispatch locally for current tab
    window.dispatchEvent(new Event(`${type}-updated`));
};

// ─── Local Storage Utils ────────────────────────────────────────────────────────
const getStorageData = <T>(key: string, initialData: T[]): T[] => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialData;
    } catch {
        return initialData;
    }
};

const setStorageData = <T>(key: string, data: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'PRD-1001',
        name: 'Hikvision Dome Camera 2MP',
        category: 'IP Cameras',
        price: 1299,
        offerPrice: 999,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=200',
        description: 'High definition 2MP dome camera with advanced night vision capabilities up to 30m. Ideal for indoor surveillance with wide angle coverage.',
        offers: ['10% OFF', 'Free Installation Setup']
    },
    {
        id: 'PRD-1002',
        name: 'Dahua Bullet Camera 4MP ColorVu',
        category: 'IP Cameras',
        price: 2499,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=200',
        description: 'Professional grade 4MP bullet camera featuring ColorVu technology for full-color images even in extreme low-light conditions. IP67 weather resistant.',
        offers: []
    },
    {
        id: 'PRD-1003',
        name: 'WD Purple 1TB Surveillance HDD',
        category: 'Storage',
        price: 3499,
        offerPrice: 3199,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&q=80&w=200',
        description: 'Purpose-built for 24/7, always-on, high-definition security systems. Supports up to 64 cameras and designed for low power consumption.',
        offers: ['Bundle Deal']
    },
    {
        id: 'PRD-1004',
        name: 'CP Plus 4 Channel DVR',
        category: 'Analog Cameras',
        price: 1899,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1589330694653-afa6dcbe197e?auto=format&fit=crop&q=80&w=200',
        description: '4 channel Digital Video Recorder supporting 1080p resolution. Easy setup with mobile app viewing capability and smart motion detection.',
        offers: []
    }
];

const INITIAL_SERVICES: Service[] = [
    {
        id: 'SRV-001',
        name: 'Basic Home Installation',
        type: 'Installation',
        price: 499,
        description: 'Complete installation and setup for up to 4 cameras including cabling and DVR configuration.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=200',
        duration: '4-6 hours',
        rating: 4.8
    },
    {
        id: 'SRV-002',
        name: 'Commercial Site Maintenance',
        type: 'Maintenance',
        price: 999,
        description: 'Comprehensive quarterly maintenance check for commercial CCTV setups.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=200',
        duration: '1 Day',
        rating: 4.9
    }
];

// ─── Products API ─────────────────────────────────────────────────────────────
export const getProducts = async (): Promise<Product[]> => {
    return getStorageData<Product>('cctv_products', INITIAL_PRODUCTS);
};

export const saveProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const products = await getProducts();
    const newProduct: Product = {
        ...product,
        id: `PRD-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setStorageData('cctv_products', [...products, newProduct]);
    notifySync('products');
    return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    setStorageData('cctv_products', products);
    notifySync('products');
    return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const products = await getProducts();
    setStorageData('cctv_products', products.filter(p => p.id !== id));
    notifySync('products');
};

// ─── Service Offerings API ────────────────────────────────────────────────────
export const getServices = async (): Promise<Service[]> => {
    return getStorageData<Service>('cctv_services', INITIAL_SERVICES);
};

export const saveService = async (service: Omit<Service, 'id'>): Promise<Service> => {
    const services = await getServices();
    const newService: Service = {
        ...service,
        id: `SRV-${Math.floor(100 + Math.random() * 900)}`
    };
    setStorageData('cctv_services', [...services, newService]);
    notifySync('services');
    return newService;
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service> => {
    const services = await getServices();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Service not found');

    const updatedService = { ...services[index], ...updates };
    services[index] = updatedService;
    setStorageData('cctv_services', services);
    notifySync('services');
    return updatedService;
};

export const deleteService = async (id: string): Promise<void> => {
    const services = await getServices();
    setStorageData('cctv_services', services.filter(s => s.id !== id));
    notifySync('services');
};

// ─── Service Bookings API ─────────────────────────────────────────────────────
export const getBookings = async (): Promise<ServiceBooking[]> => {
    return getStorageData<ServiceBooking>('cctv_bookings', []);
};

export const saveBooking = async (booking: Omit<ServiceBooking, 'id'>): Promise<ServiceBooking> => {
    const bookings = await getBookings();
    const newBooking: ServiceBooking = {
        ...booking,
        id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setStorageData('cctv_bookings', [...bookings, newBooking]);
    notifySync('bookings');
    return newBooking;
};

export const updateBooking = async (id: string, updates: Partial<ServiceBooking>): Promise<ServiceBooking> => {
    const bookings = await getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const updatedBooking = { ...bookings[index], ...updates };
    bookings[index] = updatedBooking;
    setStorageData('cctv_bookings', bookings);
    notifySync('bookings');
    return updatedBooking;
};

export const deleteBooking = async (id: string): Promise<void> => {
    const bookings = await getBookings();
    setStorageData('cctv_bookings', bookings.filter(b => b.id !== id));
    notifySync('bookings');
};

// ─── Legacy sync stubs (kept so old call sites don't break during migration) ──
export const saveProducts = () => { };
export const saveBookings = () => { };
