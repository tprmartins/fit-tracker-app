
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, Save } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
    const t = useTranslations('Profile');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Avatar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-800 shadow-xl">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trainer" />
                                <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white h-8 w-8" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Clique na imagem para alterar seu avatar.
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('personal_info')}</CardTitle>
                        <CardDescription>
                            Essas informações serão visíveis para seus alunos ou treinador.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('name_label')}</Label>
                            <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="personal@fit.com" disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">{t('bio_label')}</Label>
                            <Textarea
                                id="bio"
                                placeholder="Conte um pouco sobre você..."
                                className="min-h-[100px]"
                                defaultValue="Personal Trainer apaixonado por resultados e alta performance."
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button className="ml-auto gap-2 bg-blue-600" onClick={handleSave} disabled={isLoading}>
                            <Save className="h-4 w-4" /> {isLoading ? "Salvando..." : t('save_btn')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
