'use client';

import { useGetBalance } from '@/features/balance/hooks/use-balance';
import { formatCurrencyINR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const BalanceDisplay = () => {
    const { data: balance, isLoading } = useGetBalance();

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2">
                <div className="h-6 w-20 bg-white/20 animate-pulse rounded"></div>
            </div>
        );
    }

    if (!balance) {
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-white/80">Balance:</span>
            <Badge 
                variant={balance.balance >= 0 ? 'muted' : 'destructive'}
                className="font-semibold bg-white/20 text-white border-white/30"
            >
                {formatCurrencyINR(balance.balance)}
            </Badge>
        </div>
    );
};