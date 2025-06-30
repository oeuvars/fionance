'use client';

import { useGetBalance } from '@/features/balance/hooks/use-balance';
import { IconLoader } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
    const { data: balance, isLoading } = useGetBalance();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && balance && !balance.monthlyIncomeSource) {
            router.push('/onboarding');
        }
    }, [balance, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <IconLoader className='animate-spin'/>
            </div>
        );
    }


    return <>{children}</>;
};