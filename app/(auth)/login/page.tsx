"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, UserCheck, User, ArrowRight, ShieldCheck, Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "@/lib/api";
import { UserRole } from "@/types/UserRole";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, LoginFormData } from "@/lib/schemas";

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations('Auth');
    const { signIn } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFormError, setValue } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await api.post("/user/login", {
                document: data.email,
                password: data.password
            });

            const responseData = await response.json();
            await signIn(responseData.accessToken, responseData.refreshToken);

            if (responseData.user?.role === UserRole.Personal) {
                router.push("/personal");
            } else if (responseData.user?.role === UserRole.Student) {
                router.push("/student");
            } else if (responseData.user?.role === UserRole.Admin) {
                router.push("/admin");
            } else {
                router.push("/student");
            }

        } catch (err: any) {
            setFormError("root", { message: err.message });
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
            {/* Animated background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -right-4 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -left-4 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 right-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-md"
            >
                <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                    <CardHeader className="space-y-1 text-center pb-8 pt-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/20"
                        >
                            <Dumbbell className="h-10 w-10 text-white" />
                        </motion.div>
                        <CardTitle className="text-4xl font-black tracking-tight text-white uppercase">FitTracker</CardTitle>
                        <CardDescription className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
                            {t('login_title')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300 ml-1 flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" /> {t('email_label')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        {...register("email")}
                                        className="h-12 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    />
                                    {errors.email && (
                                        <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300 ml-1 flex items-center gap-2">
                                        <Lock className="h-3.5 w-3.5" /> {t('password_label')}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        className="h-12 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    />
                                    {errors.password && (
                                        <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-13 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-95 group rounded-xl py-6"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-3 decoration-clone">
                                        {t('submit_btn')}
                                        <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-6 text-center pb-8 border-t border-white/5 pt-8">
                        <p className="text-sm text-slate-400 font-medium">
                            {t('no_account')}{" "}
                            <Link href="/register" className="text-blue-500 hover:text-blue-400 font-bold transition-colors underline-offset-4 hover:underline">
                                {t('register_btn')}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
