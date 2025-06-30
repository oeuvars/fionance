import { client } from '@/lib/hono';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.settings.password.$patch>;
type RequestType = InferRequestType<typeof client.api.settings.password.$patch>['json'];

export const useChangePassword = () => {
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.settings.password.$patch({ json });
            return response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Password changed successfully',
                type: 'success'
            });
        },
        onError: () => {
            showToast({
                message: 'Failed to change password',
                type: 'error'
            });
        },
    });

    return mutation;
};