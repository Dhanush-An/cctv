
export interface SystemCredentials {
    email: string;
    password: string;
}

export interface SystemStore {
    admin: SystemCredentials;
    technician: SystemCredentials;
}

const STORAGE_KEY = 'cctv_system_credentials';

const defaultCredentials: SystemStore = {
    admin: {
        email: 'admin@cctv.com',
        password: 'admin123'
    },
    technician: {
        email: 'tech@cctv.com',
        password: 'tech123'
    }
};

export const getSystemCredentials = (): SystemStore => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCredentials));
        return defaultCredentials;
    }
    return JSON.parse(stored);
};

export const updateSystemCredentials = (type: 'admin' | 'technician', updates: Partial<SystemCredentials>): SystemStore => {
    const credentials = getSystemCredentials();
    const updated = {
        ...credentials,
        [type]: { ...credentials[type], ...updates }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('system-credentials-updated'));
    return updated;
};
