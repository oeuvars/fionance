import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { SheetProvider } from '@/providers/sheet-provider';
import { Toaster } from "@/components/ui/sonner"

const figtree = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Fionance - Personal Finance Tracker',
    description: 'Track your personal finances, manage budgets, and achieve your financial goals with Fionance.',
    keywords: [
        'personal finance',
        'budget tracker',
        'expense management',
        'financial planning',
        'money management',
        'financial goals',
    ],
    openGraph: {
        title: 'Fionance - Personal Finance Tracker',
        description: 'Track your personal finances, manage budgets, and achieve your financial goals with Fionance.',
        url: 'http://localhost:3000',
        siteName: 'Fionance',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Fionance - Personal Finance Tracker',
        description: 'Track your personal finances, manage budgets, and achieve your financial goals with Fionance.',
    },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body className={figtree.className}>
                <QueryProvider>
                    <SheetProvider />
                    <Toaster
                    />
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}
