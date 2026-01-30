
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Clock, Timer, CheckCircle2, Maximize2, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { FocusMode } from "@/components/focus-mode";
import Link from "next/link";

export default function StudentPlanPage() {
    const t = useTranslations('StudentPlan');
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

    const MOCK_EXERCISES = [
        { 
            id: 1, 
            name: "Agachamento Livre", 
            sets: "4 séries", 
            reps: "12 repetições", 
            weight: "80kg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
        },
        { 
            id: 2, 
            name: "Leg Press 45°", 
            sets: "3 séries", 
            reps: "15 repetições", 
            weight: "200kg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        },
        { 
            id: 3, 
            name: "Extensora", 
            sets: "3 séries", 
            reps: "12 repetições", 
            weight: "45kg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
        },
        { 
            id: 4, 
            name: "Flexora Deitado", 
            sets: "3 séries", 
            reps: "12 repetições", 
            weight: "35kg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
        },
        { 
            id: 5, 
            name: "Panturrilha Sentado", 
            sets: "4 séries", 
            reps: "15 repetições", 
            weight: "50kg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
        },
    ];

    const toggleExercise = (id: number) => {
        setCompletedExercises(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isAllCompleted = completedExercises.length === MOCK_EXERCISES.length;

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
                    <Button onClick={() => setIsWorkoutFinished(false)} className="w-full h-12 bg-blue-600 hover:bg-blue-700">Refazer Treino</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
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
                        disabled={!isAllCompleted}
                        onClick={() => setIsWorkoutFinished(true)}
                    >
                        <CheckCircle2 className="h-4 w-4" /> {t('complete_session')}
                    </Button>
                </div>
            </div>

            {isFocusModeOpen && (
                <FocusMode 
                    exercises={MOCK_EXERCISES} 
                    onClose={() => setIsFocusModeOpen(false)}
                    completedExercises={completedExercises}
                    onToggleExercise={toggleExercise}
                    onFinish={() => {
                        setIsFocusModeOpen(false);
                        setIsWorkoutFinished(true);
                    }}
                />
            )}

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Treino A: Membros Inferiores</CardTitle>
                                <CardDescription>Foco em Quadríceps e Panturrilha</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">
                                    {completedExercises.length}/{MOCK_EXERCISES.length}
                                </span>
                                <p className="text-xs text-muted-foreground text-uppercase">Exercícios</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {MOCK_EXERCISES.map((ex, index) => (
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
                                            className={`font-bold text-lg cursor-pointer ${completedExercises.includes(ex.id) ? "line-through text-muted-foreground" : ""
                                                }`}
                                        >
                                            {index + 1}. {ex.name}
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Dumbbell className="h-4 w-4" /> {ex.sets} x {ex.reps}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                                        <Clock className="h-4 w-4" /> {ex.weight}
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
