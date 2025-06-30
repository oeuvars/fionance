import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.settings.preferences.$patch>;
type RequestType = InferRequestType<typeof client.api.settings.preferences.$patch>['json'];

export const useUpdatePreferences = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.settings.preferences.$patch({ json });
            return response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Preferences updated',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['preferences'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to update preferences',
                type: 'error'
            });
        },
    });

    return mutation;
};