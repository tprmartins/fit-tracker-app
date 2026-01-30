
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Trophy, Clock } from "lucide-react";
import { StudentActivityChart } from "@/components/student-activity-chart";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StudentDashboardPage() {
    const t = useTranslations('StudentDashboard');
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                
                if (user && user.id) {
                    const response = await api.get(`/workout/student/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setWorkouts(data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch workouts", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkouts();
    }, []);

    const nextWorkout = workouts.length > 0 ? workouts[0] : null;
    const nextWorkoutExs = nextWorkout?.workoutDays?.[0]?.exercises || [];
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('welcome.title')}</h2>
                    <p className="text-muted-foreground">{t('welcome.subtitle')}</p>
                </div>
                <Link href="/student/plan">
                    <Button className="w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                        <Calendar className="h-4 w-4" /> {t('welcome.view_workout')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.workouts_done')}</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{workouts.length > 0 ? "Com Treino" : "Sem Treino"}</div>
                        <p className="text-xs text-muted-foreground">{workouts.length} plano(s) ativo(s)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.current_streak')}</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-- Dias</div>
                        <p className="text-xs text-muted-foreground">{t('stats.keep_it_up')}</p>
                    </CardContent>
                </Card>
                {/* ... Outros cards mantidos por simplicidade ... */}
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-4">
                    <StudentActivityChart />
                </div>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{nextWorkout ? nextWorkout.name : t('next_workout.title')}</CardTitle>
                        <CardDescription>{nextWorkout ? nextWorkout.description : t('next_workout.scheduled')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {nextWorkoutExs.length > 0 ? nextWorkoutExs.slice(0, 3).map((ex: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-3 border rounded bg-slate-50 dark:bg-slate-900">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold">{idx + 1}</div>
                                <div>
                                    <h4 className="font-semibold">{ex.name}</h4>
                                    <p className="text-sm text-muted-foreground">{ex.sets} sets x {ex.reps} reps</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground italic">Nenhum exercício para hoje ou sem plano de treino.</p>
                        )}
                        
                        <Link href="/student/plan" className="block">
                            <Button variant="outline" className="w-full">{t('next_workout.start_btn')}</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
