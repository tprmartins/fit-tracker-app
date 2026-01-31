"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface BlockUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    userName: string;
    isBlocking: boolean;
}

export function BlockUserDialog({ open, onOpenChange, onConfirm, userName, isBlocking }: BlockUserDialogProps) {
    const t = useTranslations('AdminDashboard.users');

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        {isBlocking ? t('block_user') : t('unblock_user')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                        {isBlocking
                            ? `${t('block_confirm')} ${userName}.`
                            : `${t('unblock_confirm')} ${userName}.`
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={isBlocking
                            ? "bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-500/20"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                        }
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
