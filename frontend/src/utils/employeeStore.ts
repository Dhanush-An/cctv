import API_BASE_URL from '../config';

export interface Employee {
    id: string;
    _id?: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    dateOfJoining: string;
    status: 'Active' | 'Inactive';
}

const API_ENDPOINT = `${API_BASE_URL}/api/employees`;

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

export const getEmployees = async (): Promise<Employee[]> => {
    try {
        return await apiFetch(API_ENDPOINT);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
};

export const saveEmployee = async (employee: Omit<Employee, 'id' | 'status'>): Promise<Employee | null> => {
    try {
        return await apiFetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(employee)
        });
    } catch (error) {
        console.error('Error saving employee:', error);
        return null;
    }
};

export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        await apiFetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

export const updateEmployee = async (id: string, updates: Partial<Omit<Employee, 'id'>>): Promise<Employee | null> => {
    try {
        return await apiFetch(`${API_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        return null;
    }
};

export const toggleEmployeeStatus = async (id: string): Promise<void> => {
    try {
        await apiFetch(`${API_ENDPOINT}/${id}/toggle-status`, { method: 'PATCH' });
    } catch (error) {
        console.error('Error toggling status:', error);
    }
};

export const validateEmployeeLogin = async (email: string, mobileNo: string): Promise<Employee | null> => {
    const employees = await getEmployees();
    const employee = employees.find(
        (emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.mobile === mobileNo
    );
    if (employee && employee.status === 'Active') {
        return employee;
    }
    return null;
};
