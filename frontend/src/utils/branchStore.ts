
export interface Branch {
    id: string;
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

const STORAGE_KEY = 'cctv_branches';

const defaultBranches: Branch[] = [
    {
        id: 'BRN-001',
        name: 'Downtown HQ',
        location: '123 Security Plaza, Tech Hub',
        manager: 'Anand Dev',
        serviceAreas: ['Downtown', 'Old City', 'West Market'],
        status: 'Operational',
        staffCount: 12,
        revenue: '₹124k',
        score: '9.8',
        customerBase: '1.2k',
        trendUp: true
    },
    {
        id: 'BRN-002',
        name: 'Westside Hub',
        location: '45 Sunset Blvd, West End',
        manager: 'Meera Iyer',
        serviceAreas: ['Westside', 'Beach Rd', 'Suburbs'],
        status: 'Operational',
        staffCount: 8,
        revenue: '₹45k',
        score: '8.5',
        customerBase: '450',
        trendUp: false
    },
    {
        id: 'BRN-003',
        name: 'East Metro Office',
        location: '88 Station Rd, East Side',
        manager: 'Suresh Raina',
        serviceAreas: ['East Metro', 'Industrial Estate'],
        status: 'Operational',
        staffCount: 15,
        revenue: '₹88k',
        score: '9.2',
        customerBase: '890',
        trendUp: true
    }
];

export const getBranches = async (): Promise<Branch[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBranches));
        return defaultBranches;
    }
    return JSON.parse(stored);
};

export const addBranch = async (branch: Omit<Branch, 'id' | 'status' | 'revenue' | 'score' | 'customerBase' | 'trendUp'>): Promise<Branch> => {
    const branches = await getBranches();
    const newId = `BRN-${String(branches.length + 1).padStart(3, '0')}`;

    const newBranch: Branch = {
        ...branch,
        id: newId,
        status: 'Operational',
        revenue: '₹0',
        score: '0.0',
        customerBase: '0',
        trendUp: true
    };

    const newBranches = [...branches, newBranch];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBranches));
    window.dispatchEvent(new CustomEvent('branches-updated'));
    return newBranch;
};

export const updateBranch = async (id: string, updates: Partial<Branch>): Promise<Branch[]> => {
    const branches = await getBranches();
    const updated = branches.map(b => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('branches-updated'));
    return updated;
};

export const deleteBranch = async (id: string): Promise<Branch[]> => {
    const branches = await getBranches();
    const updated = branches.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('branches-updated'));
    return updated;
};
