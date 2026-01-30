
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";

import { api } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [document, setDocument] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("personal");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const role = userType === "personal" ? 4 : 5;
            const response = await api.post("/user/register", {
                document,
                password,
                name,
                email,
                phone: "",
                role
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Registration failed");
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data));

            if (userType === "personal") {
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
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">{t('register_title')}</CardTitle>
                    <CardDescription className="text-slate-400">
                        {t('register_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm bg-red-500/10 border border-red-500/50 text-red-500 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="document" className="text-slate-200">CPF</Label>
                            <Input
                                id="document"
                                placeholder="000.000.000-00"
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-200">{t('name_label')}</Label>
                            <Input
                                id="name"
                                placeholder={t('name_placeholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                required
                            />
                        </div>
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
                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="text-slate-200">{t('confirm_password_label')}</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user-type" className="text-slate-200">{t('user_type_label')}</Label>
                            <Select value={userType} onValueChange={setUserType}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:ring-blue-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="personal">{t('user_type_personal')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 text-lg mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? t('loading_btn') : t('register_btn')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm text-slate-500">
                    <p>
                        {t('has_account')}{" "}
                        <Link href="/login" className="text-blue-400 hover:underline font-medium">
                            {t('submit_btn')}
                        </Link>
                    </p>
                </CardFooter>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        </div>
    );
}
