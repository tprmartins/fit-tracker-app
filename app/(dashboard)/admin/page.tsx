"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, UserCheck, UserX, Dumbbell, Activity, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { color, motion } from "framer-motion";

interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    totalPersonals: number;
    totalStudents: number;
    totalWorkouts: number;
}

export default function AdminDashboardPage() {
    const t = useTranslations('AdminDashboard');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/dashboard/admin/stats");
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">{t('title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Gerencie seu ecossistema fitness de forma inteligente.</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    index={0}
                    title={t('stats.total_users')}
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="blue"
                    description="Usuários cadastrados"
                />
                <StatCard
                    index={1}
                    title={t('stats.active_users')}
                    value={stats?.activeUsers || 0}
                    icon={UserCheck}
                    color="green"
                    trend={{ value: "4.5%", isUp: true }}
                    description="Ativos no sistema"
                />
                <StatCard
                    index={2}
                    title={t('stats.blocked_users')}
                    value={stats?.blockedUsers || 0}
                    icon={UserX}
                    color="red"
                    description="Acesso revogado"
                />
                <StatCard
                    index={3}
                    title={t('stats.total_personals')}
                    value={stats?.totalPersonals || 0}
                    icon={Activity}
                    color="purple"
                    description="Treinadores profissionais"
                />
                <StatCard
                    index={4}
                    title={t('stats.total_students')}
                    value={stats?.totalStudents || 0}
                    icon={TrendingUp}
                    color="orange"
                    description="Alunos em treinamento"
                />
                <StatCard
                    index={5}
                    title={t('stats.total_workouts')}
                    value={stats?.totalWorkouts || 0}
                    icon={Dumbbell}
                    color="blue"
                    description="Planos criados"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-xl tracking-tight uppercase">Crescimento da Plataforma</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Últimos 30 dias</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Activity className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="aspect-[21/9] flex items-end justify-between gap-3">
                        {[40, 60, 45, 70, 55, 85, 65, 90, 75, 95, 80, 100].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: "circOut" }}
                                className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-600/90 to-indigo-500/40 relative group"
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                            </motion.div>
                        ))}
                    </div>
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden"
                >
                    <h3 className="font-black text-xl mb-6 relative z-10 uppercase tracking-tight">Atalhos Rápidos</h3>
                    <div className="space-y-4 relative z-10">
                        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold block">Gerenciar Usuários</span>
                                    <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Acesso total</span>
                                </div>
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold block">Relatórios do Sistema</span>
                                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Exportar dados</span>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                </motion.div>
            </div>
        </div>
    );
}
