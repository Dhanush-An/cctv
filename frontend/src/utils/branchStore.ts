
import API_BASE_URL from '../config';

export interface Branch {
    id: string;
    _id?: string;
    name: string;
    location: string;
    manager: string;
    serviceAreas: string[];
    status: 'Operational' | 'Limited' | 'Closed';
    staffCount: number;
    revenue: string;
    score: string;
    customerBase: string;
    trendUp: boolean;
}

const API_ENDPOINT = `${API_BASE_URL}/api/branches`;

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

export const getBranches = async (): Promise<Branch[]> => {
    return apiFetch(API_ENDPOINT);
};

export const addBranch = async (branch: Omit<Branch, 'id' | 'status' | 'revenue' | 'score' | 'customerBase' | 'trendUp'>): Promise<Branch> => {
    const newBranch = await apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(branch),
    });
    window.dispatchEvent(new CustomEvent('branches-updated'));
    return newBranch;
};

export const updateBranch = async (id: string, updates: Partial<Branch>): Promise<Branch[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
    window.dispatchEvent(new CustomEvent('branches-updated'));
    return getBranches();
};

export const deleteBranch = async (id: string): Promise<Branch[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    window.dispatchEvent(new CustomEvent('branches-updated'));
    return getBranches();
};
