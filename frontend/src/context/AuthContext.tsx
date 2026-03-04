import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


type Role = 'admin' | 'technician' | 'customer' | 'employee' | null;

interface AuthContextType {
    role: Role;
    user: string | null;
    token: string | null;
    login: (role: Role, email: string, newToken?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    role: null,
    user: null,
    token: null,
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>(() => localStorage.getItem('role') as Role || null);
    const [user, setUser] = useState<string | null>(() => localStorage.getItem('user') || null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || null);

    const login = (newRole: Role, email: string, newToken?: string) => {
        setRole(newRole);
        setUser(email);
        localStorage.setItem('role', newRole || '');
        localStorage.setItem('user', email);
        if (newToken) {
            setToken(newToken);
            localStorage.setItem('token', newToken);
        }
    };

    const logout = () => {
        setRole(null);
        setUser(null);
        setToken(null);
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ role, user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
