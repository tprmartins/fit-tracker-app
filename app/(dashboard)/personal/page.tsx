"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Dumbbell, Calendar, Activity, UserPlus, Send, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface RecentActivity {
    id: string;
    userName: string;
    type: string;
    description: string;
    timeAgo: string;
    activityCount: number;
    targetName?: string;
}

export default function PersonalDashboardPage() {
    const t = useTranslations('PersonalDashboard');

    const [stats, setStats] = useState({
        totalStudents: 0,
        activePlans: 0,
        workoutsCompleted: 0,
        studentProgressChange: 0
    });
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, activitiesRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/activities')
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (activitiesRes.ok) {
                const activitiesData = await activitiesRes.json();
                setActivities(activitiesData);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Portal do Personal</h2>
                <Button variant="ghost" size="icon" onClick={fetchData} disabled={isLoading}>
                    <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.total_students')}</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">{t('stats.sub_total_students', { count: 2 })}</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.active_plans')}</CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activePlans}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('stats.sub_active_plans', {
                                percent: stats.totalStudents > 0 ? Math.round((stats.activePlans / stats.totalStudents) * 100) : 0
                            })}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.workouts_completed')}</CardTitle>
                        <Dumbbell className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.workoutsCompleted}</div>
                        <p className="text-xs text-muted-foreground">{t('stats.sub_workouts_completed')}</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.student_progress')}</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.studentProgressChange}%</div>
                        <p className="text-xs text-muted-foreground">{t('stats.sub_student_progress')}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-500" />
                            {t('recent_activity.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {activities.length === 0 && !isLoading && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Activity className="h-12 w-12 text-slate-200 mb-4" />
                                    <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
                                </div>
                            )}
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-center group relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-transparent hover:before:bg-blue-500 before:rounded-full before:transition-all">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all ${activity.type === 'StudentInvited' ? 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100' :
                                            activity.type === 'WorkoutCreated' ? 'bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-100' :
                                                'bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-100'
                                        }`}>
                                        {activity.type === 'StudentInvited' ? <UserPlus className="h-5 w-5" /> :
                                            activity.type === 'WorkoutCreated' ? <Dumbbell className="h-5 w-5" /> :
                                                <Activity className="h-5 w-5" />}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-semibold leading-none text-slate-700 dark:text-slate-200">
                                            {activity.userName === 'Personal' ? 'Você' : activity.userName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(`recent_activity.${activity.description}`, { name: activity.targetName })}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                                        {activity.timeAgo === 'time_now' ? t('recent_activity.time_now') : t('recent_activity.time_ago', { count: activity.activityCount })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">{t('quick_actions.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/personal/invite">
                            <Button className="w-full justify-start gap-4 h-14 text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 group" variant="outline">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                {t('quick_actions.add_student')}
                            </Button>
                        </Link>
                        <Link href="/personal/workouts">
                            <Button className="w-full justify-start gap-4 h-14 text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 group" variant="outline">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Dumbbell className="h-5 w-5" />
                                </div>
                                {t('quick_actions.create_workout')}
                            </Button>
                        </Link>
                        <Link href="/personal/invite">
                            <Button className="w-full justify-start gap-4 h-14 text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 group" variant="outline">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                                    <Send className="h-5 w-5" />
                                </div>
                                {t('quick_actions.send_invite')}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
