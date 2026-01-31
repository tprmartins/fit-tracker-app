
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Clock, Timer, CheckCircle2, Maximize2, Trophy, Loader2, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { FocusMode } from "@/components/focus-mode";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function StudentPlanPage() {
    const t = useTranslations('StudentPlan');
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user: authUser } = useAuth();

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!authUser?.id) return;

            try {
                const response = await api.get(`/workout/student/${authUser.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setWorkouts(data);
                }
            } catch (err) {
                console.error("Failed to fetch workouts", err);
                toast.error("Erro ao carregar treinos");
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkouts();
    }, [authUser]);

    const activeWorkout = workouts.length > 0 ? workouts[0] : null;
    const exercises = activeWorkout?.workoutDays?.[0]?.exercises || [];

    const toggleExercise = (id: number) => {
        setCompletedExercises(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isAllCompleted = exercises.length > 0 && completedExercises.length === exercises.length;

    const handleFinishSession = async () => {
        if (!activeWorkout) return;

        setIsSubmitting(true);
        try {
            const response = await api.post("/workout/execute", {
                workoutId: activeWorkout.id
            });

            if (response.ok) {
                setIsWorkoutFinished(true);
                toast.success("Treino finalizado com sucesso!");
            } else {
                toast.error("Erro ao finalizar treino");
            }
        } catch (err) {
            console.error("Failed to execute workout", err);
            toast.error("Erro ao conectar com o servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!activeWorkout) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
                <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full">
                    <Dumbbell className="h-12 w-12 text-slate-400" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Sem Treino Ativo</h2>
                    <p className="text-muted-foreground">Você ainda não possui um plano de treino atribuído pelo seu Personal.</p>
                </div>
                <Link href="/student">
                    <Button variant="outline">Voltar ao Painel</Button>
                </Link>
            </div>
        );
    }

    if (isWorkoutFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500 px-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                    <Trophy className="h-24 w-24 text-yellow-500 relative animate-bounce" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Treino Finalizado!</h2>
                    <p className="text-muted-foreground text-lg max-w-sm">Incrível trabalho hoje. Cada gota de suor te deixa mais próximo do seu objetivo.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                    <Link href="/student" className="w-full">
                        <Button variant="outline" className="w-full h-12">Voltar ao Início</Button>
                    </Link>
                    <Button onClick={() => {
                        setIsWorkoutFinished(false);
                        setCompletedExercises([]);
                    }} className="w-full h-12 bg-blue-600 hover:bg-blue-700">Refazer Treino</Button>
                </div>
            </div>
        );
    }

    const formattedExercises = exercises.map((ex: any) => ({
        ...ex,
        id: ex.id || Math.random(), // Fallback if id is missing in response
        sets: `${ex.sets} séries`,
        reps: `${ex.reps} reps`,
    }));

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{activeWorkout.name}</h2>
                    <p className="text-muted-foreground">{activeWorkout.description || t('subtitle')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="secondary"
                        className="gap-2 md:hidden bg-blue-600 text-white hover:bg-blue-700 font-bold flex-1 xs:flex-none h-11"
                        onClick={() => setIsFocusModeOpen(true)}
                    >
                        <Maximize2 className="h-4 w-4" /> {t('focus_mode')}
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1 xs:flex-none h-11">
                        <Timer className="h-4 w-4" /> {t('rest_timer')}
                    </Button>
                    <Button
                        className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto mt-2 sm:mt-0 h-11 font-bold shadow-lg"
                        disabled={!isAllCompleted || isSubmitting}
                        onClick={handleFinishSession}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        {t('complete_session')}
                    </Button>
                </div>
            </div>

            {isFocusModeOpen && (
                <FocusMode
                    exercises={formattedExercises}
                    onClose={() => setIsFocusModeOpen(false)}
                    completedExercises={completedExercises}
                    onToggleExercise={toggleExercise}
                    onFinish={() => {
                        setIsFocusModeOpen(false);
                        handleFinishSession();
                    }}
                />
            )}

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>{activeWorkout.workoutDays?.[0]?.name || "Rotina de Hoje"}</CardTitle>
                                <CardDescription>{formattedExercises.length} exercícios planejados</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">
                                    {completedExercises.length}/{formattedExercises.length}
                                </span>
                                <p className="text-xs text-muted-foreground text-uppercase font-bold">Progresso</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {formattedExercises.map((ex: any, index: number) => (
                            <div
                                key={ex.id}
                                className={`flex items-center gap-4 p-4 border-b last:border-0 transition-colors ${completedExercises.includes(ex.id) ? "bg-green-50/50 dark:bg-green-900/10" : ""
                                    }`}
                            >
                                <Checkbox
                                    id={`ex-${ex.id}`}
                                    checked={completedExercises.includes(ex.id)}
                                    onCheckedChange={() => toggleExercise(ex.id)}
                                    className="h-6 w-6"
                                />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor={`ex-${ex.id}`}
                                            className={`font-bold text-lg cursor-pointer ${completedExercises.includes(ex.id) ? "line-through text-muted-foreground opacity-50" : ""
                                                }`}
                                        >
                                            {index + 1}. {ex.name}
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                                        <Dumbbell className="h-4 w-4" /> {ex.sets} x {ex.reps}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
                                        <Dumbbell className="h-4 w-4" /> {ex.weight ? `${ex.weight}kg` : "Carga livre"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

