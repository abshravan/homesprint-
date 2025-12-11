import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserService } from '../../services/user.service';

interface User {
    id: number;
    username: string;
    display_name: string;
    role: 'admin' | 'member' | 'guest';
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const userService = getUserService();

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('homesprint_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('homesprint_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // Get user from database
            const dbUser = await userService.getByUsername(username);

            if (!dbUser) {
                return false;
            }

            // Check password (stored in localStorage for this demo)
            const credentials = JSON.parse(localStorage.getItem('homesprint_credentials') || '{}');
            if (credentials[username] !== password) {
                return false;
            }

            // Set user session
            const userSession: User = {
                id: dbUser.id!,
                username: dbUser.username,
                display_name: dbUser.display_name,
                role: dbUser.role,
            };

            setUser(userSession);
            localStorage.setItem('homesprint_user', JSON.stringify(userSession));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('homesprint_user');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
