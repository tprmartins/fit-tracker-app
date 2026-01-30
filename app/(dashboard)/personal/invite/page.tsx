
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

export default function InviteStudentPage() {
    const t = useTranslations('Invite');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/user/invite-student", {
                name,
                email,
                phone
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Falha ao enviar convite");
            }

            setIsSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setIsSent(false);
        setName("");
        setEmail("");
        setPhone("");
        setError("");
    };

    if (isSent) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="max-w-md w-full text-center p-6 space-y-4 border-slate-800 bg-slate-900 shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-green-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-2xl text-white">{t('success')}</CardTitle>
                    <CardDescription className="text-slate-400">
                        O aluno <strong>{name}</strong> receberá um e-mail em <strong>{email}</strong> com as instruções para configurar o perfil.
                    </CardDescription>
                    <Button onClick={resetForm} variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">Convidar Outro</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h2>
                <p className="text-slate-400">{t('subtitle')}</p>
            </div>

            <Card className="border-slate-800 bg-slate-900 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-white">Detalhes do Convite</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSendInvite} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm bg-red-500/10 border border-red-500/50 text-red-500 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-200">{t('name_label')}</Label>
                            <Input
                                id="name"
                                placeholder={t('name_placeholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">{t('email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-200">{t('phone_label')}</Label>
                                <Input
                                    id="phone"
                                    placeholder={t('phone_placeholder')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white h-11" disabled={isLoading}>
                            <Send className="h-4 w-4" /> {isLoading ? t('sending') : t('btn')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
