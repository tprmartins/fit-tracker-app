
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, CheckCircle2, ShieldCheck, Mail, Lock, Fingerprint, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeRegistrationSchema, CompleteRegistrationFormData } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";

function CompleteRegistrationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('CompleteRegistration');
    const tAuth = useTranslations('Auth');
    const token = searchParams.get("token");
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFormError } = useForm<CompleteRegistrationFormData>({
        resolver: zodResolver(completeRegistrationSchema)
    });

    useEffect(() => {
        if (!token) {
            setFormError("root", { message: t('token_error') });
        }
    }, [token, t, setFormError]);

    const onSubmit = async (data: CompleteRegistrationFormData) => {
        if (!token) return;

        try {
            const response = await api.post("/user/complete-registration", {
                token,
                document: data.document,
                password: data.password
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t('submit_error'));
            }

            setIsSuccess(true);
        } catch (err: any) {
            setFormError("root", { message: err.message });
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md"
            >
                <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-2xl text-center p-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/20 text-green-500">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-3xl font-black text-white mb-2 uppercase tracking-tight">{t('success_title')}</CardTitle>
                    <CardDescription className="text-slate-400 mb-8 text-lg font-medium">
                        {t('success_desc')}
                    </CardDescription>
                    <Button
                        onClick={() => router.push("/login")}
                        className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-black text-xl rounded-xl shadow-lg shadow-green-600/20 transition-all transform hover:scale-[1.02]"
                    >
                        {t('go_to_login')}
                    </Button>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10 w-full max-w-md"
        >
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <CardHeader className="space-y-1 text-center pb-8 pt-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/20"
                    >
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </motion.div>
                    <CardTitle className="text-4xl font-black tracking-tight text-white uppercase">{t('title')}</CardTitle>
                    <CardDescription className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
                        {t('subtitle')}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {errors.root && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-4 text-sm font-bold bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center gap-3"
                            >
                                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                {errors.root.message}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="document" className="text-slate-300 ml-1 flex items-center gap-2">
                                    <Fingerprint className="h-3.5 w-3.5" /> CPF
                                </Label>
                                <Input
                                    id="document"
                                    placeholder="000.000.000-00"
                                    {...register("document")}
                                    className="h-12 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    disabled={!token}
                                />
                                {errors.document && (
                                    <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{errors.document.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 ml-1 flex items-center gap-2">
                                    <Lock className="h-3.5 w-3.5" /> {tAuth('password_label')}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    className="h-12 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    disabled={!token}
                                />
                                {errors.password && (
                                    <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="text-slate-300 ml-1 flex items-center gap-2">
                                    <Lock className="h-3.5 w-3.5" /> {tAuth('confirm_password_label')}
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    {...register("confirmPassword")}
                                    className="h-12 bg-slate-800/50 border-white/5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all rounded-xl"
                                    disabled={!token}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs font-bold text-rose-500 ml-1 mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-95 group rounded-xl"
                            disabled={isSubmitting || !token}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    {t('submit_btn')}
                                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 text-center pb-8 border-t border-white/5 pt-8">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        {t('help_text')}
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default function CompleteRegistrationPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
            {/* Animated background decoration */}
            <div className="absolute inset-0 z-0 text-white">
                <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 -left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-blue-600" />}>
                <CompleteRegistrationContent />
            </Suspense>
        </div>
    );
}

