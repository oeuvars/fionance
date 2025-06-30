import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async json => {
            const response = await client.api.accounts[":id"]["$delete"]({ param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Account deleted',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['account', { id }] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Invalidate summary
        },
        onError: () => {
            showToast({
                message: 'Failed to delete account',
                type: 'error'
            });
        },
    });

    return mutation;
};
