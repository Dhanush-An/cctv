export interface Employee {
    id: string;
    name: string;
    mobile: string;
    email: string;
    address: string;
    dateOfJoining: string;
    status: 'Active' | 'Inactive';
}

import { API_URLS } from '../config';

export const getEmployees = async (): Promise<Employee[]> => {
    try {
        const response = await fetch(`${API_URLS.DASHBOARD.replace('dashboard', 'employees')}`);
        if (!response.ok) throw new Error('Failed to fetch employees');
        return await response.json();
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
};

export const saveEmployee = async (employee: Omit<Employee, 'id' | 'status'>): Promise<Employee | null> => {
    try {
        const response = await fetch(`${API_URLS.DASHBOARD.replace('dashboard', 'employees')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        if (!response.ok) throw new Error('Failed to save employee');
        return await response.json();
    } catch (error) {
        console.error('Error saving employee:', error);
        return null;
    }
};

export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URLS.DASHBOARD.replace('dashboard', 'employees')}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete employee');
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

export const updateEmployee = async (id: string, updates: Partial<Omit<Employee, 'id'>>): Promise<Employee | null> => {
    try {
        const response = await fetch(`${API_URLS.DASHBOARD.replace('dashboard', 'employees')}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update employee');
        return await response.json();
    } catch (error) {
        console.error('Error updating employee:', error);
        return null;
    }
};

export const toggleEmployeeStatus = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URLS.DASHBOARD.replace('dashboard', 'employees')}/${id}/toggle-status`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Failed to toggle status');
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
