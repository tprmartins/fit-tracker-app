"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/UserRole";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: number;
    document?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (accessToken: string, refreshToken: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromCookies = async () => {
            const token = Cookies.get("accessToken");
            if (token) {
                try {
                    const response = await api.get("/user/me");
                    if (response.ok) {
                        const userData = await response.json();
                        setUser({ ...userData, role: Number(userData.role), status: Number(userData.status) }); // Ensure robust mapping
                    } else {
                        // Token invalid/expired
                        signOut();
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                    signOut();
                }
            }
            setIsLoading(false);
        };

        loadUserFromCookies();
    }, []);

    const signIn = async (accessToken: string, refreshToken: string) => {
        setIsLoading(true);

        // Set cookies with enhanced security options
        const cookieOptions = {
            expires: 1, // 1 day for access token
            sameSite: 'strict' as const,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        };

        Cookies.set("accessToken", accessToken, { ...cookieOptions, path: '/' });
        Cookies.set("refreshToken", refreshToken, {
            ...cookieOptions,
            path: '/',
            expires: 7 // 7 days for refresh token
        });

        try {
            const response = await api.get("/user/me");
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Failed to fetch user after login", error);
            signOut();
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
        // Clear User State
        setUser(null);
        // Clear LocalStorage if any left
        if (typeof window !== "undefined") {
            localStorage.clear();
        }
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
