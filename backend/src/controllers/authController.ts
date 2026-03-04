import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../models/data.js';

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback_secret';

// Mock credentials based on previous research
const VALID_CREDENTIALS = {
    admin: '6379068721',
    technician: '6379068722',
    customer: '6379068723',
};

export const login = async (req: Request, res: Response) => {
    const { mobile, otp } = req.body;
    console.log(`[authController] Login attempt: mobile=${mobile}, otp=${otp}`);

    // In a real app, you would verify the OTP here. 
    // For now, we simulate success for any mobile number for testing
    // Dynamic role determination
    let role: string | null = null;

    // 1. Check Admin (Hardcoded for now, or could check special flag)
    if (mobile === VALID_CREDENTIALS.admin) {
        role = 'admin';
    } else {
        const employees = db.employees || [];

        const employeeMatch = employees.find(emp => emp.mobile === mobile && emp.status === 'Active');

        if (employeeMatch) {
            role = 'technician';
        } else {
            if (mobile === VALID_CREDENTIALS.technician) role = 'technician';
            else if (mobile === VALID_CREDENTIALS.customer) role = 'customer';
            else role = 'customer';
        }
    }

    if (otp) { // Accept any OTP provided by the frontend for simulation
        const token = jwt.sign(
            { mobile, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`[authController] Login success: role=${role}`);
        res.json({
            success: true,
            token,
            user: { mobile, role }
        });
    } else {
        console.log(`[authController] Login failed: Missing OTP`);
        res.status(401).json({
            success: false,
            message: 'OTP is required'
        });
    }
};

export const verifyToken = (req: Request, res: Response) => {
    // If the middleware succeeded, we just return the user info
    res.json({
        success: true,
        user: (req as any).user
    });
};
