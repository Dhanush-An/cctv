import { getAuthHeaders } from './apiHelper';
import API_BASE_URL from '../config';

export interface RegisteredCustomer {
    id: string;
    _id?: string;
    name: string;
    mobile: string;
    email: string;
    registeredAt: string;
    status: 'Active' | 'Inactive';
    address?: string;
}

const API_ENDPOINT = `${API_BASE_URL}/api/customers`;

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

export const getCustomers = async (): Promise<RegisteredCustomer[]> => {
    return apiFetch(API_ENDPOINT);
};

export const getCustomerById = async (id: string): Promise<RegisteredCustomer> => {
    return apiFetch(`${API_ENDPOINT}/${id}`);
};

export const addCustomer = async (customer: Omit<RegisteredCustomer, 'id' | 'registeredAt' | 'status'>): Promise<RegisteredCustomer> => {
    return apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(customer),
    });
};

export const updateCustomer = async (id: string, updates: Partial<RegisteredCustomer>): Promise<RegisteredCustomer> => {
    return apiFetch(`${API_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
};

export const deleteCustomer = async (id: string): Promise<void> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
};

export const emailExists = async (email: string): Promise<boolean> => {
    const customers = await getCustomers();
    return customers.some((c) => c.email.toLowerCase() === email.toLowerCase());
};
