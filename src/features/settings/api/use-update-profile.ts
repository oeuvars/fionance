import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.settings.profile.$patch>;
type RequestType = InferRequestType<typeof client.api.settings.profile.$patch>['json'];

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.settings.profile.$patch({ json });
            return response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Profile updated',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to update profile',
                type: 'error'
            });
        },
    });

    return mutation;
};