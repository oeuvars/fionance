import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export const useGetPreferences = () => {
    const query = useQuery({
        queryKey: ['preferences'],
        queryFn: async () => {
            const response = await client.api.settings.preferences.$get();

            if (!response.ok) {
                throw new Error('Failed to fetch preferences');
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};