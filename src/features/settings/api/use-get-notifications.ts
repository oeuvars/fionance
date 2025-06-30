import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export const useGetNotifications = () => {
    const query = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await client.api.settings.notifications.$get();

            if (!response.ok) {
                throw new Error('Failed to fetch notification settings');
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};