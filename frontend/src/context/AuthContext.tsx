import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    token: string | null;
    isAdmin: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('admin_token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('admin_token');
    };

    const isAdmin = !!token;

    return (
        <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
