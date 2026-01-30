
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dumbbell, LayoutDashboard, Users, Calendar, LogOut, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useTranslations } from "next-intl";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const t = useTranslations('Dashboard');
    const isPersonal = pathname?.includes("/personal");

    const personalLinks = [
        { href: "/personal", label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { href: "/personal/students", label: t('sidebar.students'), icon: Users },
        { href: "/personal/workouts", label: t('sidebar.workouts'), icon: Dumbbell },
    ];

    const studentLinks = [
        { href: "/student", label: t('sidebar.overview'), icon: LayoutDashboard },
        { href: "/student/plan", label: t('sidebar.my_plan'), icon: Calendar },
        { href: "/student/progress", label: t('sidebar.progress'), icon: Dumbbell },
    ];

    const links = isPersonal ? personalLinks : studentLinks;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-950 text-white pt-4 pb-6 px-4">
            <div className="flex items-center gap-3 px-4 py-6 mb-4 border-b border-slate-800/50">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <Dumbbell className="text-white h-6 w-6" />
                </div>
                <div>
                    <span className="font-bold text-lg block leading-none">FitTracker</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Pro</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    // Fix: Exact match for root links, prefix match for sub-pages
                    const isActive = link.href === "/personal" || link.href === "/student"
                        ? pathname === link.href
                        : pathname?.startsWith(link.href);
                    return (
                        <Link key={link.href} href={link.href}>
                            <span className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-medium translate-x-1"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1"
                            )}>
                                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110 duration-300", isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400")} />
                                <span className="relative z-10">{link.label}</span>
                                {isActive && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-2 pt-6 border-t border-slate-800/50">
                <Link href="/profile">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200 group">
                        <User className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        {t('sidebar.profile')}
                    </button>
                </Link>
                <Link href="/login">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200 group">
                        <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                        {t('sidebar.sign_out')}
                    </button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-row bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-72 flex flex-col min-h-screen">
                <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-40 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 bg-slate-950 border-r-slate-800 text-white w-72">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>

                        <h2 className="text-xl font-bold capitalize text-slate-800 dark:text-slate-100 pl-2">
                            {/* Simplify title logic for now */}
                            FitTracker
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 pr-2">
                        <ModeToggle />
                        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">User Name</p>
                                <p className="text-xs text-slate-500">{isPersonal ? t('header.personal_trainer') : t('header.student')}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px]">
                                <div className="h-full w-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
