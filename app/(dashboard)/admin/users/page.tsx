"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { UserTable } from "@/components/admin/UserTable";

import { motion } from "framer-motion";

export default function UserManagementPage() {
    const t = useTranslations('AdminDashboard.users');
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/user/all");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">{t('title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t('subtitle')}</p>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <UserTable users={users} onRefresh={fetchUsers} />
                </motion.div>
            )}
        </div>
    );
}
