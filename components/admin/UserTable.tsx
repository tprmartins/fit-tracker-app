"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { BlockUserDialog } from "./BlockUserDialog";
import { cn } from "@/lib/utils";

interface UserAdmin {
    id: string;
    name: string;
    email: string;
    document: string;
    role: number;
    isActive: boolean;
}

interface UserTableProps {
    users: UserAdmin[];
    onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
    const t = useTranslations('AdminDashboard.users');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);

    const handleActionClick = (user: UserAdmin) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const confirmToggleStatus = async () => {
        if (!selectedUser) return;

        setIsProcessing(selectedUser.id);
        const endpoint = selectedUser.isActive ? 'block' : 'unblock';
        try {
            const response = await api.post(`/user/${selectedUser.id}/${endpoint}`, {});
            if (response.ok) {
                toast.success(selectedUser.isActive ? t('block_user') + " OK" : t('unblock_user') + " OK");
                onRefresh();
            }
        } catch (error) {
            console.error("Action failed", error);
        } finally {
            setIsProcessing(null);
            setDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const getRoleName = (roleId: number) => {
        switch (roleId) {
            case 1: return "Admin";
            case 4: return "Personal";
            case 5: return "Student";
            default: return "Unknown";
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md overflow-hidden shadow-2xl shadow-blue-500/5 transition-all duration-500">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                        <TableHead className="font-bold">Nome</TableHead>
                        <TableHead className="font-bold">Email</TableHead>
                        <TableHead className="font-bold">Perfil</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="text-right font-bold pr-6">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell className="text-slate-500 dark:text-slate-400">{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                    {getRoleName(user.role)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {user.isActive ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 border-none transition-colors">
                                        <UserCheck className="w-3 h-3 mr-1" />
                                        {t('status_active')}
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 border-none transition-colors">
                                        <UserX className="w-3 h-3 mr-1" />
                                        {t('status_blocked')}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2">
                                        <DropdownMenuLabel className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Gerenciar</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => handleActionClick(user)}
                                            disabled={isProcessing === user.id}
                                            className={cn(
                                                "cursor-pointer rounded-lg font-medium",
                                                user.isActive ? "text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30" : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/30"
                                            )}
                                        >
                                            {user.isActive ? (
                                                <><UserX className="w-4 h-4 mr-2" /> {t('block_user')}</>
                                            ) : (
                                                <><UserCheck className="w-4 h-4 mr-2" /> {t('unblock_user')}</>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <BlockUserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={confirmToggleStatus}
                userName={selectedUser?.name || ""}
                isBlocking={selectedUser?.isActive || false}
            />
        </div>
    );
}
