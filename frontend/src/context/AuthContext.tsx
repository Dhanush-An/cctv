import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


type Role = 'admin' | 'technician' | 'customer' | 'employee' | null;

interface AuthContextType {
    role: Role;
    user: string | null;
    login: (role: 'admin' | 'technician' | 'customer' | 'employee', email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    role: null,
    user: null,
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>(null);
    const [user, setUser] = useState<string | null>(null);

    const login = (newRole: 'admin' | 'technician' | 'customer' | 'employee', email: string) => {
        setRole(newRole);
        setUser(email);
    };

    const logout = () => {
        setRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ role, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
