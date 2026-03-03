export interface Employee {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    dateOfJoining: string;
    status: 'Active' | 'Inactive';
}

const STORAGE_KEY = 'cctv_employees';

// Initialize with some dummy data if empty
const initializeStore = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const dummyData: Employee[] = [
            {
                id: 'EMP-001',
                name: 'Rajesh Kumar',
                mobile: '6379068722',
                email: 'rajesh.k@cctvpro.in',
                address: '123 Tech Park, OMR, Chennai',
                dateOfJoining: '2023-01-15',
                status: 'Active'
            },
            {
                id: 'EMP-002',
                name: 'Priya Sharma',
                mobile: '9876543211',
                email: 'priya.s@cctvpro.in',
                address: '456 Innovation Hub, Whitefield, Bangalore',
                dateOfJoining: '2023-03-22',
                status: 'Active'
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
    }
};

export const getEmployees = (): Employee[] => {
    initializeStore();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveEmployee = (employee: Omit<Employee, 'id' | 'status'>): Employee => {
    const employees = getEmployees();
    const newEmployee: Employee = {
        ...employee,
        id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
        status: 'Active'
    };
    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return newEmployee;
};

export const deleteEmployee = (id: string): void => {
    const employees = getEmployees();
    const filtered = employees.filter(emp => emp.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateEmployee = (id: string, updates: Partial<Omit<Employee, 'id'>>): Employee | null => {
    const employees = getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;

    employees[index] = { ...employees[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return employees[index];
};

export const toggleEmployeeStatus = (id: string): void => {
    const employees = getEmployees();
    const updated = employees.map(emp => {
        if (emp.id === id) {
            return { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' as const };
        }
        return emp;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const validateEmployeeLogin = (email: string, mobileNo: string): Employee | null => {
    const employees = getEmployees();
    const employee = employees.find(
        (emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.mobile === mobileNo
    );
    // Only allow Active employees to log in
    if (employee && employee.status === 'Active') {
        return employee;
    }
    return null;
};
