const STORAGE_KEY = 'cctv_customers';

export interface RegisteredCustomer {
    id: string;
    name: string;
    mobile: string;
    email: string;
    registeredAt: string; // ISO string
    status: 'Active' | 'Inactive';
    address?: string;
}

// Initialize with a dummy customer if empty
const initializeStore = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const dummyData: RegisteredCustomer[] = [
            {
                id: 'CUST-001',
                name: 'Test Customer',
                mobile: '6379068723',
                email: 'customer@cctvpro.in',
                registeredAt: new Date().toISOString(),
                status: 'Active'
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
    }
};

export const getCustomers = async (): Promise<RegisteredCustomer[]> => {
    initializeStore();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const addCustomer = async (customer: Omit<RegisteredCustomer, 'id' | 'registeredAt' | 'status'>): Promise<RegisteredCustomer> => {
    const customers = await getCustomers();

    // Check if mobile or email already exists
    if (customers.some(c => c.mobile === customer.mobile)) {
        throw new Error('This mobile number is already registered.');
    }
    if (customers.some(c => c.email.toLowerCase() === customer.email.toLowerCase())) {
        throw new Error('This email is already registered.');
    }

    const newCustomer: RegisteredCustomer = {
        ...customer,
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        registeredAt: new Date().toISOString(),
        status: 'Active'
    };

    customers.push(newCustomer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    return newCustomer;
};

export const emailExists = async (email: string): Promise<boolean> => {
    const customers = await getCustomers();
    return customers.some((c) => c.email.toLowerCase() === email.toLowerCase());
};
