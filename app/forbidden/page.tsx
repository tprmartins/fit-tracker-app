"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultDashboard } from "@/lib/route-protection";

export default function ForbiddenPage() {
    const router = useRouter();
    const { user } = useAuth();

    const handleGoBack = () => {
        if (user) {
            router.push(getDefaultDashboard(user.role));
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100 shadow-2xl text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-900/30 text-red-500">
                        <ShieldAlert className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">
                        Acesso Negado
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-base">
                        Você não tem permissão para acessar esta página. Entre em contato com o administrador se acredita que isso é um erro.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-300">
                            <strong>Código:</strong> 403 Forbidden
                        </p>
                        {user && (
                            <p className="text-sm text-slate-300 mt-2">
                                <strong>Seu Perfil:</strong> {user.role === 4 ? "Personal" : user.role === 5 ? "Aluno" : "Admin"}
                            </p>
                        )}
                    </div>
                    <Button
                        onClick={handleGoBack}
                        className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                        <Home className="h-4 w-4" />
                        Voltar ao Dashboard
                    </Button>
                </CardContent>
            </Card>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-slate-950 to-slate-950"></div>
        </div>
    );
}
