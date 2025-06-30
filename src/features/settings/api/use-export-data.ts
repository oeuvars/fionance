import { client } from '@/lib/hono';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface TransactionExport {
    id: string;
    date: string;
    amount: number;
    payee: string | null;
    notes: string | null;
    category: string;
    account: string;
    createdAt: string;
}

const convertToCSV = (transactions: TransactionExport[]): string => {
    if (transactions.length === 0) return 'No transactions to export';
    
    // Define CSV headers
    const headers = ['Date', 'Amount', 'Payee', 'Category', 'Account', 'Notes', 'Created At'];
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...transactions.map(transaction => [
            transaction.date,
            transaction.amount,
            `"${transaction.payee || ''}"`, // Wrap in quotes to handle commas
            `"${transaction.category || ''}"`,
            `"${transaction.account || ''}"`,
            `"${transaction.notes || ''}"`,
            transaction.createdAt
        ].join(','))
    ].join('\n');
    
    return csvContent;
};

export const useExportData = () => {
    const { showToast } = useToast();
    
    const mutation = useMutation<TransactionExport[], Error>({
        mutationFn: async (): Promise<TransactionExport[]> => {
            const response = await client.api.settings.export.$post();

            if (!response.ok) {
                throw new Error('Failed to export data');
            }

            const { data } = await response.json();
            return data as TransactionExport[];
        },
        onSuccess: (transactions: TransactionExport[]) => {
            if (!transactions || transactions.length === 0) {
                showToast({
                    message: 'No transactions found to export',
                    type: 'error'
                });
                return;
            }

            const csvContent = convertToCSV(transactions);
            const blob = new Blob([csvContent], { 
                type: 'text/csv;charset=utf-8;' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fionance-transactions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast({
                message: `${transactions.length} transactions exported successfully`,
                type: 'success'
            });
        },
        onError: () => {
            showToast({
                message: 'Failed to export transactions',
                type: 'error'
            });
        },
    });

    return mutation;
};