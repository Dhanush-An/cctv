import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole: 'admin' | 'technician' | 'customer';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { role } = useAuth();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
        const redirectMap: Record<string, string> = {
            admin: '/admin',
            technician: '/technician',
            customer: '/customer',
        };
        return <Navigate to={redirectMap[role] ?? '/login'} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
