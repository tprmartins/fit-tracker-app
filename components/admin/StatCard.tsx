"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color?: string;
    index?: number;
}

export function StatCard({ title, value, icon: Icon, description, trend, color = "blue", index = 0 }: StatCardProps) {
    const colors: Record<string, string> = {
        blue: "from-blue-600 to-indigo-600 shadow-blue-500/20",
        green: "from-emerald-600 to-teal-600 shadow-emerald-500/20",
        purple: "from-purple-600 to-violet-600 shadow-purple-500/20",
        orange: "from-orange-600 to-amber-600 shadow-orange-500/20",
        red: "from-red-600 to-rose-600 shadow-red-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Card className="overflow-hidden border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Icon className="h-24 w-24 scale-150 rotate-12" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                        {title}
                    </CardTitle>
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg shadow-black/10`}
                    >
                        <Icon className="h-5 w-5 text-white" />
                    </motion.div>
                </CardHeader>

                <CardContent className="relative z-10">
                    <div className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white mb-2 tabular-nums">
                        {value}
                    </div>
                    {(description || trend) && (
                        <div className="flex items-center gap-2">
                            {trend && (
                                <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${trend.isUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                    {trend.isUp ? '↑' : '↓'} {trend.value}
                                </span>
                            )}
                            {description && (
                                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-tight">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
} 
