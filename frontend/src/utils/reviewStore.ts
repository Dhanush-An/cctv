export interface Review {
    id: string;
    user: string;
    customerEmail: string;
    rating: number;
    comment: string;
    type: 'Product' | 'Service';
    target: string;
    technicianName?: string;
    orderId?: string;
    status: 'Published' | 'Pending' | 'Flagged' | 'Rejected';
    date: string;
}

const STORAGE_KEY = 'cctv_reviews';

const defaultReviews: Review[] = [
    {
        id: 'REV-001',
        user: 'Sarah Jenkins',
        customerEmail: 'sarah@example.com',
        rating: 5,
        comment: 'Absolutely fantastic service! The technician was very polite, explained the entire setup to me clearly, and left the workspace totally clean.',
        type: 'Service',
        target: 'CCTV Installation - Villa',
        technicianName: 'Dhanush',
        orderId: 'ORD-10922',
        status: 'Published',
        date: '10 Mar 2026'
    },
    {
        id: 'REV-002',
        user: 'David Chen',
        customerEmail: 'david@demo.com',
        rating: 5,
        comment: 'Quick and efficient. He identified the issue with the old DVR board right away and had the replacement hooked up incredibly fast.',
        type: 'Service',
        target: 'DVR Repair & Setup',
        technicianName: 'Dhanush',
        orderId: 'ORD-22341',
        status: 'Published',
        date: '11 Mar 2026'
    },
    {
        id: 'REV-003',
        user: 'Michael Brown',
        customerEmail: 'mike@example.com',
        rating: 4,
        comment: 'Good camera quality, but the delivery was delayed by a day.',
        type: 'Product',
        target: '4K Dome Camera',
        status: 'Published',
        date: '09 Mar 2026'
    }
];

export const getReviews = async (): Promise<Review[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
        return defaultReviews;
    }
    return JSON.parse(stored);
};

export const addReview = async (review: Omit<Review, 'id' | 'status' | 'date'>): Promise<Review> => {
    const reviews = await getReviews();
    const newId = `REV-${String(reviews.length + 1).padStart(3, '0')}`;

    // Default to pending for moderation
    const fullReview: Review = {
        ...review,
        id: newId,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const newReviews = [fullReview, ...reviews];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    return fullReview;
};

export const updateReviewStatus = async (id: string, newStatus: Review['status']): Promise<Review[]> => {
    const reviews = await getReviews();
    const updated = reviews.map(r => r.id === id ? { ...r, status: newStatus } : r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
