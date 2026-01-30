
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentWeightChart } from "@/components/student-weight-chart";
import { Activity, Ruler, Target, Weight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StudentProgressPage() {
    const t = useTranslations('StudentProgress');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-4">
                    <StudentWeightChart />
                </div>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('measurements')}</CardTitle>
                        <CardDescription>Última atualização: 15 de Jan, 2024</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{t('chest')}</span>
                                <Ruler className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="text-2xl font-bold">104 cm</p>
                            <p className="text-xs text-green-500 font-medium">+2cm vs Dez</p>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{t('waist')}</span>
                                <Activity className="h-4 w-4 text-red-500" />
                            </div>
                            <p className="text-2xl font-bold">88 cm</p>
                            <p className="text-xs text-green-500 font-medium">-1.5cm vs Dez</p>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{t('biceps')}</span>
                                <Target className="h-4 w-4 text-purple-500" />
                            </div>
                            <p className="text-2xl font-bold">38 cm</p>
                            <p className="text-xs text-green-500 font-medium">+0.5cm vs Dez</p>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{t('thighs')}</span>
                                <Weight className="h-4 w-4 text-orange-500" />
                            </div>
                            <p className="text-2xl font-bold">62 cm</p>
                            <p className="text-xs text-green-500 font-medium">+1cm vs Dez</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
