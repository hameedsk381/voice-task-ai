'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    token: string | null;
    businessId: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Load token from localStorage
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken);
            // Decode simple business_id if possible or just assume authenticated
            // For a real app, you'd decode the JWT here
        } else if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login' && pathname !== '/dashboard/register') {
            router.push('/dashboard/login');
        }
    }, [pathname, router]);

    const login = (newToken: string) => {
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setBusinessId(null);
        router.push('/dashboard/login');
    };

    return (
        <AuthContext.Provider value={{
            token,
            businessId,
            isAuthenticated: !!token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
