
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, UserCheck, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/user/login", {
                document: email,
                password
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Invalid credentials");
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirecionar baseado no role (precisamos do role no user data)
            // Se o login response não retornar o role, podemos buscar no perfil ou assumir baseado no email mock
            if (data.user?.name?.toLowerCase().includes("personal") || email.includes("personal")) {
                router.push("/personal");
            } else {
                router.push("/student");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                        <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">{t('login_title')}</CardTitle>
                    <CardDescription className="text-slate-400">
                        {t('login_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm bg-red-500/10 border border-red-500/50 text-red-500 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">{t('email_label')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('email_placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-200">{t('password_label')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? t('loading_btn') : t('submit_btn')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-slate-500">
                    <p>
                        {t('no_account')}{" "}
                        <Link href="/register" className="text-blue-400 hover:underline font-medium">
                            {t('register_btn')}
                        </Link>
                    </p>
                    <div className="space-y-2 pt-2 border-t border-slate-800 w-full">
                        <p>{t('mock_creds')}</p>
                        <div className="flex gap-2 justify-center w-full">
                            <Button variant="ghost" size="sm" onClick={() => setEmail("personal@fit.com")} className="text-xs hover:text-blue-400">
                                <UserCheck className="mr-1 h-3 w-3" /> Personal
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEmail("student@fit.com")} className="text-xs hover:text-purple-400">
                                <User className="mr-1 h-3 w-3" /> Student
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        </div>
    );
}
