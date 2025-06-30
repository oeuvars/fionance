'use client';

import { IncomeSetup } from '@/features/balance/components/income-setup';
import { useSetupIncome } from '@/features/balance/hooks/use-balance';
import { useRouter } from 'next/navigation';

const OnboardingPage = () => {
    const { mutate: setupIncome, isPending } = useSetupIncome();

    console.log("fsfds", setupIncome)
    const router = useRouter();

    const handleSubmit = (values: { source: string; amount: number }) => {
        setupIncome(values, {
            onSuccess: () => {
                router.push('/');
            },
        });
    };

    return (
        <div className="-mt-20 flex items-center justify-center">
            <IncomeSetup onSubmit={handleSubmit} disabled={isPending} />
        </div>
    );
};

export default OnboardingPage;