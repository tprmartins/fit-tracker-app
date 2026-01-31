
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, User, Mail, Lock, Fingerprint, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { registerSchema, RegisterFormData } from "@/lib/schemas";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 4,
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const response = await api.post("/user/register", {
                ...data,
                phone: data.phone || ""
            });

            const result = await response.json();

            // Set cookies manually if needed, or assume middleware/auth context handle this
            document.cookie = `accessToken=${result.accessToken}; path=/; max-age=3600; SameSite=Lax`;
            document.cookie = `refreshToken=${result.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
            localStorage.setItem('user', JSON.stringify(result));

            if (data.role === 4) {
                router.push("/personal");
            } else {
                router.push("/student");
            }
        } catch (err: any) {
            setApiError(err.message || "Erro ao realizar registro");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
            {/* Animated background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-lg"
            >
                <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <CardHeader className="space-y-1 text-center pb-8 pt-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20"
                        >
                            <Dumbbell className="h-8 w-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-white">{t('register_title')}</CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            {t('register_desc')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300 ml-1 flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> {t('name_label')}
                                </Label>
                                <Input
                                    id="name"
                                    placeholder={t('name_placeholder')}
                                    {...register("name")}
                                    className="h-11 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                />
                                {errors.name && <p className="text-xs text-red-400 mt-1 ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300 ml-1 flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" /> {t('email_label')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        {...register("email")}
                                        className="h-11 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    />
                                    {errors.email && <p className="text-xs text-red-400 mt-1 ml-1">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="document" className="text-slate-300 ml-1 flex items-center gap-2">
                                        <Fingerprint className="h-3.5 w-3.5" /> CPF
                                    </Label>
                                    <Input
                                        id="document"
                                        placeholder="000.000.000-00"
                                        {...register("document")}
                                        className="h-11 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    />
                                    {errors.document && <p className="text-xs text-red-400 mt-1 ml-1">{errors.document.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300 ml-1 flex items-center gap-2">
                                        <Lock className="h-3.5 w-3.5" /> {t('password_label')}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        className="h-11 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    />
                                    {errors.password && <p className="text-xs text-red-400 mt-1 ml-1">{errors.password.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-300 ml-1 flex items-center gap-2">
                                        <Lock className="h-3.5 w-3.5" /> {t('confirm_password_label')}
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        {...register("confirmPassword")}
                                        className="h-11 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    />
                                    {errors.confirmPassword && <p className="text-xs text-red-400 mt-1 ml-1">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg mt-4 shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-95 group rounded-xl"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {t('register_btn')}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 text-center pb-8">
                        <p className="text-sm text-slate-400">
                            {t('has_account')}{" "}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                                {t('submit_btn')}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

