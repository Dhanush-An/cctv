import { getEmployees } from './employeeStore';
import { getCustomers } from './customerStore';

let currentOTP: string | null = null;

export const VALID_CREDENTIALS = {
    admin: '6379068721',
    technician: '6379068722',
    customer: '6379068723',
};

export const determineUserRole = async (mobile: string): Promise<'admin' | 'technician' | 'customer' | null> => {
    // 1. Check Admin (Hardcoded)
    if (mobile === VALID_CREDENTIALS.admin) {
        return 'admin';
    }

    // 2. Check Employees (Technicians)
    const employees = getEmployees();
    const activeEmployee = employees.find(emp => emp.mobile === mobile && emp.status === 'Active');
    if (activeEmployee) {
        return 'technician';
    }

    // 3. Check Customers
    // For now, check hardcoded customer number or db customers
    if (mobile === VALID_CREDENTIALS.customer) {
        return 'customer';
    }
    const customers = await getCustomers();
    const activeCustomer = customers.find(c => c.mobile === mobile);
    if (activeCustomer) {
        return 'customer';
    }

    return null;
};

// Simulate sending an OTP.
export const sendOTP = async (mobile: string): Promise<{ success: boolean; role?: 'admin' | 'technician' | 'customer', otp?: string }> => {
    const role = await determineUserRole(mobile);

    return new Promise((resolve) => {
        setTimeout(() => {
            if (role) {
                // Generate a random 6-digit OTP
                currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
                console.log(`[authUtils] OTP ${currentOTP} sent to ${mobile} for detected role ${role}`);
                resolve({ success: true, role, otp: currentOTP });
            } else {
                console.log(`[authUtils] Phone number ${mobile} not found in any system.`);
                resolve({ success: false });
            }
        }, 800);
    });
};

export const verifyOTP = async (_mobile: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (currentOTP && otp === currentOTP) {
                currentOTP = null; // Clear OTP after successful use
                resolve(true);
            } else {
                resolve(false);
            }
        }, 800);
    });
};

// Generates an OTP for a user who does not yet exist.
export const sendRegistrationOTP = async (mobile: string): Promise<{ success: boolean; otp: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate a random 6-digit OTP
            currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`[authUtils] Registration OTP ${currentOTP} sent to ${mobile}`);
            resolve({ success: true, otp: currentOTP });
        }, 800);
    });
};
