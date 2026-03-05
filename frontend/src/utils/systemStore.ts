import API_BASE_URL from '../config';

export interface SystemCredentials {
    email: string;
    password: string;
}

export interface SystemStore {
    admin: SystemCredentials;
    technician: SystemCredentials;
}

const STORAGE_KEY = 'cctv_system_credentials';
const API_ENDPOINT = `${API_BASE_URL}/api/system`;

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

export const getSystemCredentials = async (): Promise<SystemStore | null> => {
    try {
        return await apiFetch(`${API_ENDPOINT}/${STORAGE_KEY}`);
    } catch (error) {
        console.error('Error fetching system credentials:', error);
        return null;
    }
};

export const updateSystemCredentials = async (type: 'admin' | 'technician', updates: Partial<SystemCredentials>): Promise<SystemStore | null> => {
    try {
        const current = await getSystemCredentials();
        const updated = {
            ...current,
            [type]: { ...current?.[type], ...updates }
        };
        const result = await apiFetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ key: STORAGE_KEY, value: updated })
        });
        window.dispatchEvent(new CustomEvent('system-credentials-updated'));
        return result;
    } catch (error) {
        console.error('Error updating system credentials:', error);
        return null;
    }
};
