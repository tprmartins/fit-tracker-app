
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Dumbbell, User, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function WorkoutsPage() {
    const t = useTranslations('Workouts');
    const { user: authUser } = useAuth();
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!authUser?.id) return;
            try {
                const response = await api.get(`/workout/personal/${authUser.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setWorkouts(data);
                }
            } catch (err) {
                console.error("Failed to fetch workouts", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkouts();
    }, [authUser]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>
                <Link href="/personal/workouts/create">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> {t('create_btn')}
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : workouts.length === 0 ? (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
                        <Dumbbell className="h-12 w-12 text-slate-300" />
                        <h3 className="text-xl font-bold">Nenhum treino criado</h3>
                        <p className="text-slate-500 max-w-xs">Você ainda não criou nenhum plano de treino para seus alunos.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workouts.map((workout) => (
                        <Card key={workout.id} className="hover:border-blue-500 transition-colors cursor-pointer overflow-hidden group">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex justify-between items-start">
                                    <span className="truncate pr-2">{workout.name}</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full font-bold uppercase tracking-wider">
                                        {t('card.active')}
                                    </span>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 group-hover:text-blue-500 transition-colors">
                                    <User className="h-3 w-3" />
                                    {/* Ideally we'd have the student name here, but the API response might need it. 
                                        Filtering by PersonalId returns workouts. We'll need a different endpoint 
                                        if we want student names in the summary, or ensure the response has it.
                                    */}
                                    {workout.description || "Treino Personalizado"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{workout.durationWeeks}</span> {t('card.weeks')}
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-4">
                                        <Dumbbell className="h-4 w-4 text-indigo-500" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{workout.frequencyDaysPerWeek}</span> {t('card.days_per_week')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
