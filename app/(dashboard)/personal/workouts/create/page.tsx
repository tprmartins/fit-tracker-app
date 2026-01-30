"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Dumbbell, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

export default function CreateWorkoutPage() {
    const router = useRouter();
    const t = useTranslations('WorkoutCreate');
    const [activeTab, setActiveTab] = useState("details");
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [workoutData, setWorkoutData] = useState({
        name: "",
        studentId: "",
        durationWeeks: 4,
        frequencyDaysPerWeek: 5,
        description: "Plano de treino personalizado"
    });

    const [exercises, setExercises] = useState([
        { id: Date.now(), name: "", sets: "4", reps: "12", weight: "60", videoUrl: "" }
    ]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get("/student");
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                }
            } catch (err) {
                console.error("Failed to fetch students", err);
            }
        };
        fetchStudents();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};
            const personalId = user.id || "00000000-0000-0000-0000-000000000000";

            const payload = {
                ...workoutData,
                personalId,
                workoutDays: [
                    {
                        name: "Treino A",
                        exercises: exercises.map(({ id, ...rest }) => rest)
                    }
                ]
            };

            const response = await api.post("/workout", payload);
            if (response.ok) {
                alert("Workout created successfully!");
                router.push("/personal");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while saving the workout.");
        } finally {
            setIsLoading(false);
        }
    };

    const addExercise = () => {
        setExercises([...exercises, { id: Date.now(), name: "", sets: "4", reps: "12", weight: "0", videoUrl: "" }]);
    };

    const removeExercise = (id: number) => {
        if (exercises.length > 1) {
            setExercises(exercises.filter(ex => ex.id !== id));
        }
    };

    const updateExercise = (id: number, field: string, value: string) => {
        setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex w-full mb-8 overflow-x-auto scrollbar-hide bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <TabsTrigger value="details" className="flex-1 text-[10px] xs:text-xs md:text-sm py-2">{t('tabs.details')}</TabsTrigger>
                    <TabsTrigger value="exercises" className="flex-1 text-[10px] xs:text-xs md:text-sm py-2">{t('tabs.exercises')}</TabsTrigger>
                    <TabsTrigger value="review" className="flex-1 text-[10px] xs:text-xs md:text-sm py-2">{t('tabs.review')}</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('tabs.details')}</CardTitle>
                            <CardDescription>Defina as informações básicas do plano.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('details.plan_name')}</Label>
                                <Input 
                                    id="name" 
                                    placeholder={t('details.plan_name_placeholder')} 
                                    value={workoutData.name}
                                    onChange={(e) => setWorkoutData({...workoutData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="student">{t('details.student')}</Label>
                                <Select 
                                    value={workoutData.studentId}
                                    onValueChange={(val) => setWorkoutData({...workoutData, studentId: val})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('details.student_placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student: any) => (
                                            <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                                        ))}
                                        {students.length === 0 && <SelectItem value="none" disabled>Nenhum aluno encontrado</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">{t('details.duration')}</Label>
                                    <Input 
                                        id="duration" 
                                        type="number" 
                                        value={workoutData.durationWeeks}
                                        onChange={(e) => setWorkoutData({...workoutData, durationWeeks: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="frequency">{t('details.frequency')}</Label>
                                    <Input 
                                        id="frequency" 
                                        type="number" 
                                        value={workoutData.frequencyDaysPerWeek}
                                        onChange={(e) => setWorkoutData({...workoutData, frequencyDaysPerWeek: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => setActiveTab("exercises")} className="ml-auto">Continuar</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="exercises">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t('tabs.exercises')}</CardTitle>
                                <CardDescription>Adicione os exercícios por dia de treino.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> {t('exercises.day')}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6 space-y-6">
                            <div className="p-3 sm:p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-base md:text-lg">{t('exercises.day')} 1: Superiores A</h3>
                                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>

                                <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground px-2 uppercase tracking-wider">
                                    <div className="col-span-3">{t('exercises.exercise_name')}</div>
                                    <div className="col-span-2">{t('exercises.sets')}</div>
                                    <div className="col-span-2">{t('exercises.reps')}</div>
                                    <div className="col-span-2">{t('exercises.weight')}</div>
                                    <div className="col-span-2">{t('exercises.video_url')}</div>
                                    <div className="col-span-1"></div>
                                </div>

                                <div className="space-y-4 md:space-y-2">
                                    {exercises.map((ex) => (
                                        <div key={ex.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-2 p-3 md:p-0 border md:border-0 rounded-lg md:rounded-none bg-white dark:bg-slate-950 md:bg-transparent items-stretch md:items-center relative">
                                            <div className="w-full md:col-span-3 space-y-1.5 md:space-y-0">
                                                <Label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60">{t('exercises.exercise_name')}</Label>
                                                <Input 
                                                    placeholder="Ex: Supino Reto" 
                                                    value={ex.name}
                                                    onChange={(e) => updateExercise(ex.id, "name", e.target.value)}
                                                    className="h-9 text-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 md:contents gap-2">
                                                <div className="w-full md:col-span-2 space-y-1.5 md:space-y-0">
                                                    <Label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60">{t('exercises.sets')}</Label>
                                                    <Input 
                                                        type="number" 
                                                        value={ex.sets}
                                                        onChange={(e) => updateExercise(ex.id, "sets", e.target.value)}
                                                        className="h-9 text-sm"
                                                    />
                                                </div>
                                                <div className="w-full md:col-span-2 space-y-1.5 md:space-y-0">
                                                    <Label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60">{t('exercises.reps')}</Label>
                                                    <Input 
                                                        type="text" 
                                                        value={ex.reps}
                                                        onChange={(e) => updateExercise(ex.id, "reps", e.target.value)}
                                                        className="h-9 text-sm"
                                                    />
                                                </div>
                                                <div className="w-full md:col-span-2 space-y-1.5 md:space-y-0">
                                                    <Label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60">{t('exercises.weight')}</Label>
                                                    <Input 
                                                        type="number" 
                                                        value={ex.weight}
                                                        onChange={(e) => updateExercise(ex.id, "weight", e.target.value)}
                                                        className="h-9 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full md:col-span-2 space-y-1.5 md:space-y-0">
                                                <Label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60">{t('exercises.video_url')}</Label>
                                                <Input 
                                                    type="url" 
                                                    placeholder="https://..." 
                                                    value={ex.videoUrl}
                                                    onChange={(e) => updateExercise(ex.id, "videoUrl", e.target.value)}
                                                    className="h-9 text-sm"
                                                />
                                            </div>
                                            <div className="absolute top-2 right-2 md:relative md:top-0 md:right-0 md:col-span-1 flex justify-end">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive h-8 w-8"
                                                    onClick={() => removeExercise(ex.id)}
                                                    disabled={exercises.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button onClick={addExercise} variant="ghost" size="sm" className="w-full border-dashed border-2 gap-2 mt-2">
                                    <Plus className="h-4 w-4" /> {t('exercises.add_exercise')}
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" onClick={() => setActiveTab("details")}>Voltar</Button>
                            <Button onClick={() => setActiveTab("review")}>Continuar</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="review">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('review.summary')}</CardTitle>
                            <CardDescription>Revise as informações antes de salvar.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 mb-2">
                                    <Dumbbell className="h-5 w-5" />
                                    <span className="font-bold">Hipertrofia Intermediária</span>
                                </div>
                                <div className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                    <p>Aluno: Alice Johnson</p>
                                    <p>Duração: 4 semanas</p>
                                    <p>Frequência: 5 dias por semana</p>
                                    <p>Total de Exercícios: {exercises.length}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" onClick={() => setActiveTab("exercises")}>Voltar</Button>
                            <Button 
                                className="gap-2 bg-green-600 hover:bg-green-700" 
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                <Save className="h-4 w-4" /> {isLoading ? "Salvando..." : t('review.save_btn')}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
