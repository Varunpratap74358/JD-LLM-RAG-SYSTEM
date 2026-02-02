import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    token: string | null;
    isAdmin: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const savedToken = await AsyncStorage.getItem('admin_token');
            if (savedToken) setToken(savedToken);
            setLoading(false);
        };
        loadToken();
    }, []);

    const login = async (newToken: string) => {
        setToken(newToken);
        await AsyncStorage.setItem('admin_token', newToken);
    };

    const logout = async () => {
        setToken(null);
        await AsyncStorage.removeItem('admin_token');
    };

    const isAdmin = !!token;

    return (
        <AuthContext.Provider value={{ token, isAdmin, login, logout, loading }}>
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
