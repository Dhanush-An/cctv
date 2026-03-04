export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    type: 'Product' | 'Service';
    target: string;
    status: 'Published' | 'Pending' | 'Flagged' | 'Rejected';
    date: string;
}

const STORAGE_KEY = 'cctv_reviews';

const defaultReviews: Review[] = [
    {
        id: 'REV-001',
        user: 'Rahul Sharma',
        rating: 5,
        comment: 'Excellent installation service. The technician was very professional and explained everything clearly.',
        type: 'Service',
        target: 'Home Installation',
        status: 'Published',
        date: '10 Mar 2026'
    },
    {
        id: 'REV-002',
        user: 'Priya Patel',
        rating: 4,
        comment: 'Good camera quality, but the delivery was delayed by a day.',
        type: 'Product',
        target: '4K Dome Camera',
        status: 'Pending',
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
