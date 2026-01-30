
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Dumbbell, Calendar, Activity, UserPlus, Send } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PersonalDashboardPage() {
    const t = useTranslations('PersonalDashboard');

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.total_students')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.active_plans')}</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">72% of total students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.workouts_completed')}</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.student_progress')}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">Average strength gain</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('recent_activity.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Alice Johnson</p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('recent_activity.completed_workout')} "Leg Day A"
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">Just now</div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Bob Smith</p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('recent_activity.started_plan')} "Hypertrophy Phase 1"
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">2h ago</div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Charlie Brown</p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('recent_activity.updated_weight')} 82.5kg
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">5h ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('quick_actions.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/personal/invite">
                            <Button className="w-full justify-start gap-4 h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:translate-x-1 bg-white dark:bg-slate-900 border-2" variant="outline">
                                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 shadow-sm">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                {t('quick_actions.add_student')}
                            </Button>
                        </Link>
                        <Link href="/personal/workouts/create">
                            <Button className="w-full justify-start gap-4 h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:translate-x-1 bg-white dark:bg-slate-900 border-2" variant="outline">
                                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 shadow-sm">
                                    <Dumbbell className="h-6 w-6" />
                                </div>
                                {t('quick_actions.create_workout')}
                            </Button>
                        </Link>
                        <Button className="w-full justify-start gap-4 h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:translate-x-1 bg-white dark:bg-slate-900 border-2" variant="outline">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 shadow-sm">
                                <Send className="h-6 w-6" />
                            </div>
                            {t('quick_actions.send_invite')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
