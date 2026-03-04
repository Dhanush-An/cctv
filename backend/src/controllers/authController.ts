import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback_secret';

// Mock credentials based on previous research
const VALID_CREDENTIALS = {
    admin: '6379068721',
    technician: '6379068722',
    customer: '6379068723',
};

export const login = async (req: Request, res: Response) => {
    const { mobile, otp } = req.body;

    // In a real app, you would verify the OTP here. 
    // For now, we simulate success for the valid mobile numbers.
    let role: string | null = null;
    if (mobile === VALID_CREDENTIALS.admin) role = 'admin';
    else if (mobile === VALID_CREDENTIALS.technician) role = 'technician';
    else if (mobile === VALID_CREDENTIALS.customer) role = 'customer';

    if (role && otp === '123456') { // Assuming a fixed OTP for testing
        const token = jwt.sign(
            { mobile, role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { mobile, role }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid mobile number or OTP'
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
