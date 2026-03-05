
import API_BASE_URL from '../config';

export interface ContactMessage {
    id: string;
    _id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'New' | 'Read' | 'Replied';
    date: string;
}

const API_ENDPOINT = `${API_BASE_URL}/api/contacts`;

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

export const getContactMessages = async (): Promise<ContactMessage[]> => {
    return apiFetch(API_ENDPOINT);
};

export const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'status' | 'date'>): Promise<ContactMessage> => {
    const newMessage = await apiFetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(message),
    });
    window.dispatchEvent(new CustomEvent('contact-messages-updated'));
    return newMessage;
};

export const updateMessageStatus = async (id: string, status: ContactMessage['status']): Promise<ContactMessage[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
    window.dispatchEvent(new CustomEvent('contact-messages-updated'));
    return getContactMessages();
};

export const deleteMessage = async (id: string): Promise<ContactMessage[]> => {
    await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    window.dispatchEvent(new CustomEvent('contact-messages-updated'));
    return getContactMessages();
};
