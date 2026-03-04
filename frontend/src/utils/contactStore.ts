
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'New' | 'Read' | 'Replied';
    date: string;
}

const STORAGE_KEY = 'cctv_contact_messages';

const defaultMessages: ContactMessage[] = [
    {
        id: 'MSG-001',
        name: 'Amit Kumar',
        email: 'amit@example.com',
        subject: 'Inquiry about bulk installation',
        message: 'I am looking for a security solution for my office complex. Do you provide bulk discounts?',
        status: 'New',
        date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
        id: 'MSG-002',
        name: 'Sonal Verma',
        email: 'sonal@example.com',
        subject: 'Support for existing setup',
        message: 'My dome camera is showing some flicker during night vision. Can you send a technician?',
        status: 'Read',
        date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
];

export const getContactMessages = async (): Promise<ContactMessage[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages));
        return defaultMessages;
    }
    return JSON.parse(stored);
};

export const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'status' | 'date'>): Promise<ContactMessage> => {
    const messages = await getContactMessages();
    const newId = `MSG-${String(messages.length + 1).padStart(3, '0')}`;

    const newMessage: ContactMessage = {
        ...message,
        id: newId,
        status: 'New',
        date: new Date().toISOString()
    };

    const newMessages = [newMessage, ...messages];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));

    // Notify about new message if needed (broadcast channel could be added here)
    window.dispatchEvent(new CustomEvent('contact-messages-updated'));

    return newMessage;
};

export const updateMessageStatus = async (id: string, status: ContactMessage['status']): Promise<ContactMessage[]> => {
    const messages = await getContactMessages();
    const updated = messages.map(m => m.id === id ? { ...m, status } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('contact-messages-updated'));
    return updated;
};

export const deleteMessage = async (id: string): Promise<ContactMessage[]> => {
    const messages = await getContactMessages();
    const updated = messages.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('contact-messages-updated'));
    return updated;
};
