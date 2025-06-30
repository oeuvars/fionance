import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.settings.notifications.$patch>;
type RequestType = InferRequestType<typeof client.api.settings.notifications.$patch>['json'];

export const useUpdateNotifications = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.settings.notifications.$patch({ json });
            return response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Notification settings updated',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to update notification settings',
                type: 'error'
            });
        },
    });

    return mutation;
};