import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import Customer from '../models/Customer.js';

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback_secret';

// Mock credentials based on previous research
const VALID_CREDENTIALS = {
    admin: '6379068721',
    technician: '6379068722',
    customer: '6379068723',
};

export const login = async (req: Request, res: Response) => {
    try {
        const { mobile, otp } = req.body;
        console.log(`[authController] Login attempt: mobile=${mobile}, otp=${otp}`);

        let role: string | null = null;

        // 1. Check Admin
        if (mobile === VALID_CREDENTIALS.admin) {
            role = 'admin';
            console.log(`[authController] Admin matched: ${mobile}`);
        } else {
            const employeeMatch = await Employee.findOne({
                mobile: mobile.trim(),
                status: 'Active'
            });

            if (employeeMatch) {
                role = 'technician';
                console.log(`[authController] Technician matched: ${employeeMatch.name}`);
            } else {
                // Check if it's a registered customer
                const customerMatch = await Customer.findOne({
                    mobile: mobile.trim()
                });

                if (customerMatch) {
                    role = 'customer';
                } else if (mobile === VALID_CREDENTIALS.technician) {
                    role = 'technician';
                } else {
                    role = 'customer'; // Default for testing
                }
            }
        }

        if (otp) {
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
            res.status(401).json({
                success: false,
                message: 'OTP is required'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const verifyToken = (req: Request, res: Response) => {
    res.json({
        success: true,
        user: (req as any).user
    });
};
