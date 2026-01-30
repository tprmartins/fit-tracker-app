
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

export default function CompleteRegistrationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('Auth');
    const token = searchParams.get("token");

    const [document, setDocument] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Token de convite não encontrado ou inválido.");
        }
    }, [token]);

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        
        setError("");
        
        if (password !== confirmPassword) {
            setError("Senhas não conferem");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post("/user/complete-registration", {
                token,
                document,
                password
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Falha ao completar cadastro");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
                <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100 shadow-2xl text-center p-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-green-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">Cadastro Concluído!</CardTitle>
                    <CardDescription className="text-slate-400 mb-6">
                        Seu perfil foi ativado com sucesso. Agora você já pode acessar a plataforma.
                    </CardDescription>
                    <Button 
                        onClick={() => router.push("/login")} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                        Ir para Login
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                        <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">Completar Cadastro</CardTitle>
                    <CardDescription className="text-slate-400">
                        Defina suas credenciais de acesso para começar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleComplete} className="space-y-4">
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
                                disabled={!token || isLoading}
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
                                disabled={!token || isLoading}
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
                                disabled={!token || isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 text-lg mt-2"
                            disabled={isLoading || !token}
                        >
                            {isLoading ? t('loading_btn') : "Finalizar Cadastro"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-slate-500">
                        Precisa de ajuda? Entre em contato com seu Personal.
                    </p>
                </CardFooter>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        </div>
    );
}
