import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useGetBalance = () => {
    const { showToast } = useToast();

    const query = useQuery({
        queryKey: ['balance'],
        queryFn: async () => {
            const response = await client.api.balance.$get();

            if (!response.ok) {
                showToast({
                    message: 'Failed to fetch balance',
                    type: 'error'
                });
                throw new Error('Failed to fetch balance');
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};