"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Dumbbell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultDashboard } from "@/lib/route-protection";
import { useEffect, useState } from "react";

export default function NotFound() {
    const router = useRouter();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGoHome = () => {
        if (user) {
            router.push(getDefaultDashboard(user.role));
        } else {
            router.push("/");
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <CardHeader className="space-y-6 text-center relative z-10">
                    {/* 404 Animation */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-bounce">
                            4
                        </div>
                        <div className="relative">
                            <Dumbbell className="h-24 w-24 text-blue-500 animate-spin-slow" />
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                        </div>
                        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-400 animate-bounce delay-200">
                            4
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-bold tracking-tight text-white">
                        Página Não Encontrada
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-lg max-w-md mx-auto">
                        Parece que você se perdeu no caminho do treino! Esta página não existe ou foi movida.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                    {/* Helpful Suggestions */}
                    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Search className="h-5 w-5 text-blue-400" />
                            Sugestões:
                        </h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>Verifique se o endereço foi digitado corretamente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>A página pode ter sido removida ou renomeada</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>Use os botões abaixo para navegar</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={handleGoHome}
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12"
                        >
                            <Home className="h-5 w-5" />
                            {user ? "Ir para Dashboard" : "Ir para Início"}
                        </Button>
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="gap-2 border-slate-700 text-slate-200 hover:bg-slate-800 h-12"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Voltar
                        </Button>
                    </div>

                    {/* Error Code */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-slate-500">
                            Código de Erro: <span className="font-mono">404 NOT_FOUND</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                .delay-200 {
                    animation-delay: 200ms;
                }
                .delay-1000 {
                    animation-delay: 1000ms;
                }
            `}</style>
        </div>
    );
}
