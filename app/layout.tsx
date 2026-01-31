
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
// Import translations directly or fetch them
import ptMessages from '@/messages/pt.json';
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FitTracker",
    description: "Personal Trainer Management System",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <NextIntlClientProvider locale="pt" messages={ptMessages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                        <Toaster position="top-right" richColors />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
