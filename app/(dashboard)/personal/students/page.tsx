"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Mail, Phone, Dumbbell, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { User } from "@/contexts/AuthContext";

export default function StudentsPage() {
    const t = useTranslations('Students');
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: number) => {
        switch (status) {
            case 1: // Active
                return "bg-green-500/10 text-green-500 border-green-500/50";
            case 3: // PendingCompletion
                return "bg-amber-500/10 text-amber-500 border-amber-500/50";
            default:
                return "bg-slate-500/10 text-slate-500 border-slate-500/50";
        }
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 1: return "Ativo";
            case 3: return "Pendente";
            default: return "Inativo";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>
                <Button
                    className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push("/personal/invite")}
                >
                    <Plus className="h-4 w-4" /> {t('add_btn')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('card_title')}</CardTitle>
                    <CardDescription>
                        {t('card_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t('search_placeholder')}
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">{t('table.avatar')}</TableHead>
                                    <TableHead>{t('table.name')}</TableHead>
                                    <TableHead className="hidden md:table-cell">{t('table.status')}</TableHead>
                                    <TableHead className="text-right">{t('table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            Nenhum aluno encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{student.name}</span>
                                                <span className="text-xs text-muted-foreground md:hidden">{student.email}</span>
                                                <span className="text-xs text-muted-foreground hidden md:block">{student.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(student.status)}`}>
                                                {getStatusLabel(student.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('actions.label')}</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <UserIcon className="mr-2 h-4 w-4" /> {t('actions.view_profile')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Dumbbell className="mr-2 h-4 w-4" /> {t('actions.manage_workouts')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Mail className="mr-2 h-4 w-4" /> {t('actions.send_email')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
