
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Dumbbell, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WorkoutsPage() {
    const t = useTranslations('Workouts');

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Mock Workout Cards */}
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:border-blue-500 transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span>Hipertrofia Fase {i}</span>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{t('card.active')}</span>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <User className="h-3 w-3" /> Alice Johnson
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> 4 {t('card.weeks')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Dumbbell className="h-4 w-4" /> 5 {t('card.days_per_week')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
